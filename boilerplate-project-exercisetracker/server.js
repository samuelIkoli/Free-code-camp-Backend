const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)


const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  count: {
    type: Number,
  },
  log: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
    },
  ],
});



const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
  },
);



const exerciseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
  },
  duration: {
    type: Number,
  },
  date: {
    type: Date,
  },
});


const User = mongoose.model("User", userSchema);

const Log = mongoose.model("Log", logSchema);

const Exercise = mongoose.model("Exercise", exerciseSchema);

app.get('/', (req, res) => {
  console.log(mongoose.connection.readyState);

  res.sendFile(__dirname + '/views/index.html')
});

app.get("/api/users", async (req, res) => {
  const users = await User.find({})
  console.log(mongoose.connection.readyState);

  res.json(users)
})



app.post("/api/users", async (req, res) => {
  const _id = mongoose.Types.ObjectId();
  const { username } = req.body;
  let user = new User({
    _id,
    username,
  });
  await user.save((err) => {
    if (err) return console.log(err);

    const log = new Log({
      userId: user._id,
      count: 0,
    });

    log.save((err) => {
      if (err) return console.log(err);
    });
  });
  res.json({
    _id: _id,
    username,
  });
});


app.post('/api/users/:_id/exercises', (req, res) => {
  // Get data from form
  const { description, duration } = req.body
  let date
  if (req.body.date) {
    date = new Date(req.body.date)
  }
  else {
    date = new Date()
  }
  const id = req.params._id
  console.log(date)
  console.log(typeof (date))
  User.findById(id, (err, userData) => {
    if (err || !userData) {
      res.send("could not find user")
    }
    else {
      const newExercise = new Exercise({
        userId: id,
        description: description,
        duration: duration,
        date
      })

      newExercise.save((err, data) => {
        if (err || !data) {
          res.send("error")
        }
        else {
          const { description, duration, date } = data
          console.log(typeof (data.date))
          res.json({
            username: userData.username,
            description,
            duration,
            date: new Date(Date.parse(date)).toDateString(),
            _id: userData._id
          })
        }
      })
    }
  });

});


app.get('/api/users/:_id/logs', (req, res) => {

  const id = req.params._id;
  const { from, to } = req.query;
  let limit;
  if (req.query.limit) {
    limit = parseInt(req.query.limit)
  }
  else {
    limit = 500
  }
  User.findById(id, (err, userData) => {
    if (err || !userData) {
      res.send("could not find user")
    }
    else {
      let dateObj = {}
      if (from) {
        dateObj["$gte"] = new Date(from)
      }
      if (to) {
        dateObj["$lte"] = new Date(to)
      }

      let filter = {
        userId: id
      }
      if (from || to) {
        filter.date = dateObj
      }

      Exercise.find(filter).limit(+limit).exec((err, data) => {
        if (err) {
          res.json({})
        }
        else {
          const count = data.length
          const rawLog = data
          const { username, _id } = userData;
          const log = rawLog.map((l) => ({
            description: l.description.toString(),
            duration: parseInt(l.duration),
            date: new Date(Date.parse(l.date)).toDateString()
          }))

          res.json({ username, count, _id, log })
        }
      })
    }
  });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
