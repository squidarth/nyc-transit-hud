import csv
import datetime
import os
import requests
from collections import defaultdict
from flask import Flask, send_from_directory
from flask_cors import CORS
from google.transit import gtfs_realtime_pb2
from typing import List, Tuple

app = Flask(__name__, static_url_path='', static_folder='webapp/build')
CORS(app)

feed = gtfs_realtime_pb2.FeedMessage()

routes_mapping = {}
with open("routes.txt") as routes_csv:
    routes_reader = csv.reader(routes_csv, delimiter=',')
    for route in routes_reader:
        routes_mapping[route[0]] = route[2]

stops_mapping = defaultdict(list) 
with open("stops.txt") as stops_csv:
    stops_reader = csv.reader(stops_csv, delimiter=",")
    for stop in stops_reader:
        stops_mapping[stop[2]].append(stop[0])

def parse_time(provided_ts: int) -> datetime.datetime:
    return datetime.datetime.fromtimestamp(provided_ts)

def displayable_time(timestamp: datetime.datetime) -> str:
    return (timestamp.strftime("%H:%M:%S")  , str(int((timestamp - datetime.datetime.now()).seconds/60)))

def displayable_route(route: str) -> str:
    return routes_mapping[route[:-1]] + route[-1]

def convert_time(arrival: int) -> str:
    return displayable_time(parse_time(arrival))

def convert_times(provided_arrivals: List[int]) -> List[str]:
    return [convert_time(arrival) for arrival in provided_arrivals ]

def is_valid_time(provided_ts: int) -> str:
    return (parse_time(provided_ts) - datetime.datetime.now()).days >= 0 and (parse_time(provided_ts) - datetime.datetime.now()).seconds > 60

# TODO: Don't hardcode this, allow these to be passed in query params
relevant_stops = stops_mapping["Atlantic Av-Barclays Ctr"]
trains_for_alerts = ["B", "D", "N", "Q", "R", "2", "3", "4", "5" ]

# These are the endpoints for fetching all of the realtime
# feeds for all of the trains.
endpoints = [
    "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
    "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
    "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm"
]

alerts_endpoint = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts"


@app.route("/")
def index():
    return send_from_directory(app.static_folder,'index.html')

@app.route("/arrivals")
def arrivals():
    upcoming_arrivals = []
    for endpoint in endpoints:
        response = requests.get(
            endpoint,
            headers={"x-api-key": os.environ["MTA_API_KEY"] }
        )

        feed_json = feed.FromString(response.content)

        # stop_time.update.stop_id[-1] gives the direction of the train, which
        # is either "N" (Northbound) or "S" (Southbound).
        upcoming_arrivals += [(stop_time_update.arrival.time, stop_time_update.stop_id[-1], entity.trip_update.trip.route_id)
            for entity in feed_json.entity
            for stop_time_update 
            in entity.trip_update.stop_time_update
            if any([stop in stop_time_update.stop_id for stop in relevant_stops]) and
             is_valid_time(stop_time_update.arrival.time) ]

    arrivals_by_route = defaultdict(list)
    for arrival in upcoming_arrivals:
        # To form the full route, include the direction.
        arrivals_by_route[str(arrival[2]) + str(arrival[1])].append(arrival[0])
        
    next_arrivals = dict([(displayable_route(route), convert_times(sorted(arrivals)[:4])) for route, arrivals in arrivals_by_route.items()])
    return next_arrivals

@app.route("/alerts")
def alerts():
    response = requests.get(
        alerts_endpoint,
        headers={"x-api-key": os.environ["MTA_API_KEY"] }
    )

    feed_json = feed.FromString(response.content)
    return {
        "alerts": sorted(list(set([(informed_entity.route_id, translation.text) 
          for  entity in feed_json.entity for informed_entity in entity.alert.informed_entity 
          for translation in entity.alert.header_text.translation 
          for active_period in entity.alert.active_period if informed_entity.route_id
          in trains_for_alerts  and translation.language == "en" and active_period.end > datetime.datetime.now().timestamp()])), key=lambda item: item[0])
    }
