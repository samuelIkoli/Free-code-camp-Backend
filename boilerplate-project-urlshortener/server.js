require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const dns = require('dns');

app.use(bodyParser());


mongoose.connect(process.env.MONGO_URI)


const port = process.env.PORT || 3000;


const urlSchema = new mongoose.Schema({
  shorturl: Number,
  url: String,
});

let Url = mongoose.model("Url", urlSchema);



app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

const protocol_regex = /^\D{3,5}:\/\//;

const validate_url = (req, res, next) => {
  console.log("------request------------------");
  console.log(req.body.url);
  console.log("------validate------------------");
  console.log("protocol: " + protocol_regex.test(req.body.url));
  console.log("------validate------------------");
  if (protocol_regex.test(req.body.url)) {
    console.log("probs a url");
    return next();
  } else {
    return res.json({
      error: 'invalid url',
    });
  }
  next();
};

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
  console.log(mongoose.connection.readyState);

});




// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});


app.post("/api/shorturl", validate_url, (req, res) => {
  // let newUrl = new Url({ shorturl: 1000, url: req.body.url });
  Url.findOne({ url: req.body.url }, (err, data) => {
    //if shorturl already exists, show that on browser
    if (err) return console.log(err);
    if (data) {
      const { url, shorturl } = data;
      res.json({ original_url: url, short_url: shorturl });
    } else {
      Url.findOne()
        .sort("-shorturl")
        .exec(function (err, member) {
          if (err) return console.log(err);
          const newShort = member.shorturl + 1;
          let newUrl = new Url({
            shorturl: newShort,
            url: req.body.url,
          });
          newUrl.save();
          res.json({
            original_url: req.body.url,
            short_url: newShort,
          });
        });
    }
   
  });
});

app.get('/api/shorturl/:short_url', async function (req, res) {
  try {
    const urlParams = await Url.findOne({
      shorturl: req.params.short_url
    })
    if (urlParams) {
      console.log(urlParams.url)
      res.redirect(urlParams.url)
    } else {
      return res.status(404).json('No URL found')
    }
  } catch (err) {
    console.log(err)
    res.status(500).json('Server error')
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
})
