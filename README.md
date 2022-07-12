## Development Notes

Currently need to run this with:

```
PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python ipython
```

for the program to work. The protobufs don't seem to work without it. There seems to be some type of version incompatibility, that I can come back and fix at some point.


### Running backend in dev

```
MTA_API_KEY=API_KEY FLASK_APP=app PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python flask run
```

### Running webapp

```
$ cd webapp
$ npm run start
```