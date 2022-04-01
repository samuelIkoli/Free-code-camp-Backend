var express = require('express');
var app = express();
var dotenv = require('dotenv').config();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));


app.use(function middleware(req, res, next) {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

console.log("Hello World")

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

app.get("/json", (req, res) => {
    if (process.env.MESSAGE_STYLE === "uppercase") {
        res.json({
            message: "Hello json".toUpperCase()
        })
    }
    res.json({
        message: "Hello json"
    })
});

app.get('/now', (req, res, next) => {
    req.time = new Date().toString();
    next();
}, (req, res) => {
    res.json({ time: req.time });
});

app.get('/:word/echo', (req, res) => {
    res.json({ echo: req.params.word });
});

app.route('/name')
    .get((req, res) => {
        res.json({ name: `${req.query.first} ${req.query.last}` });
    })
    .post((req, res) => {
        res.json({ name: `${req.body.first} ${req.body.last}` });
    });





app.use("/public", express.static(__dirname + "/public"));





























module.exports = app;
