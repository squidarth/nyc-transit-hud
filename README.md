# Summary

This is an application that displays an arrivals board for
the New York City subway. It's in _very early_ stages, and at
the moment, only works for a single subway station.

See https://nyc-transit-hub.onrender.com/ for what this looks like.

## Development

### Running the backend

```
$ pip install -r requirements.txt
$ MTA_API_KEY=API_KEY FLASK_APP=app PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python flask run
```

### Running frontend in dev

```
$ cd webapp
$ npm run start
```

### Production

To deploy this, there is a `./build.sh` script that you can run, and then after that,
start the Flask app with a WSGI server, like [gunicorn](https://gunicorn.org/).

```
$ ./build.sh
$ MTA_API_KEY=API_KEY FLASK_APP=app PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python gunicorn app:app
```