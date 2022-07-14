import './App.css';
import React, { useEffect, useState } from 'react';

var domain = "http://127.0.0.1:5000"

if (process.env.NODE_ENV === "production") {
  domain = ""
}

function getTrainExtraStyles(train) {
  switch(train) {
    case "2":
      return {backgroundColor: "red"}
    case "3":
      return {backgroundColor: "red"}
    case "Q":
      return {backgroundColor: "yellow", color: "black"}
    case "N":
      return {backgroundColor: "yellow", color: "black"}
    case "R":
      return {backgroundColor: "yellow", color: "black"}
    case "W":
      return {backgroundColor: "yellow", color: "black"}
    case "D":
      return {backgroundColor: "orange"}
    case "B":
      return {backgroundColor: "orange"}
    case "F":
      return {backgroundColor: "orange"}
    case "M":
      return {backgroundColor: "orange"}
    case "4":
      return {backgroundColor: "green"}
    case "5":
      return {backgroundColor: "green"}
    default:
      return {}
  }
}

function PendingDisplay() {
  return (
    <div>
      Waiting Results...
    </div>
  )
}

function TrainIndicator(props) {
  return <span style={getTrainExtraStyles(props.train)}className="train-styling">{props.train}</span>
}

function Alerts(props) {
  var alertsSection =  props.alerts.alerts.map( alert =>
    <p key={alert}><TrainIndicator train={alert[0]} />{alert[1]}</p>
  )

  return <div>
    {alertsSection}
  </div>
}
function Direction(props) {
  var directionString = ""
  if (props.direction === "N") {
    directionString = "Northbound"
  } else {
    directionString = "Southbound"
  }
  return <span className="direction" >{directionString}</span>
}


function Subway(props) {
  var fullTrainString = props.train;

  var direction = fullTrainString.slice(-1);
  var train = fullTrainString.slice(0, fullTrainString.length - 1)
  return (
    <span>
      <TrainIndicator train={train} />
      <Direction direction={direction}></Direction>
    </span>
  )
}



function App() {
  const [getArrivals, setArrivals] = useState({})
  const [getAlerts, setAlerts] = useState({})

  function fetchArrivals() {
    fetch(domain + '/arrivals').then(response => {
      console.log("SUCCESS", response)
      return response.json()
    }).then(actualData => {
      console.log(actualData)
      setArrivals(actualData)
    }).catch(error => {
      console.log(error)
    })
  }

  function fetchAlerts() {
    fetch(domain + '/alerts').then(response => {
      console.log("SUCCESS", response)
      return response.json()
    }).then(actualData => {
      console.log(actualData)
      setAlerts(actualData)
    }).catch(error => {
      console.log(error)
    })
  }

  useEffect(()=>{
    fetchArrivals() 
    setInterval(() => {
      fetchArrivals()
    }, 10000)

    fetchAlerts()
    setInterval(() => {
      fetchAlerts()
    }, 60000)
  }, [])

  var arrivalsContent = <PendingDisplay></PendingDisplay>
  if (Object.keys(getArrivals).length !== 0) {
    arrivalsContent = Object.entries(getArrivals).map((item) => {
      const arrivals = item[1].map((arrivalTime) => <span className="individual-arrival">{arrivalTime[1]},  </span>)
      return <div className="subway-line">
        <span>
          <Subway train={item[0]}></Subway>
        </span>
        <span>
          {arrivals}
        </span>
      </div>
    })
  }

  var alertsContent = <div></div>
  if (Object.keys(getAlerts).length !== 0) {
    alertsContent = <Alerts alerts={getAlerts}></Alerts>
  }
  return (
    <div className="App">
      <div className="arrivals">
          <h2>Next Arrivals at Atlantic Ave / Barclays Center</h2>
          <div className="content-block">

            {arrivalsContent}
          </div>
      </div>
      <div className="alerts">
        {alertsContent}
      </div>
    </div>
  );
}

export default App;
