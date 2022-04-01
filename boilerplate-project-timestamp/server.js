// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api/:date", function (req, res) {
  let date;
  if (isNaN(Number(req.params.date))) {
    date = new Date(req.params.date);
  } else {
    date = new Date(parseInt(req.params.date));
  }
  const utcValue = date.toUTCString();
  const unixValue = date.getTime();
  if (isNaN(unixValue) || utcValue === "Invalid Date") {
    res.json({ error: utcValue });
  } else {
    res.json({ unix: unixValue, utc: utcValue });
  }
});
app.get("/api", function (req, res) {

  var unixDate = {}

  unixDate['unix'] = new Date().getTime()
  unixDate['utc'] = new Date().toUTCString()

  res.json(unixDate);

});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
