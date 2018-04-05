const express = require("express");
const {ObjectID} = require("mongodb");
const bodyParser = require("body-parser");
const moment = require("moment");
const cors = require("cors");

var {mongoose} = require("./db/mongoose");
var {Poll} = require("./models/poll");
var {User} = require("./models/user");

var app = express();
var port = process.env.PORT || 3005;

app.use(bodyParser.json());
app.use(cors());


app.post("/user", (req, res, next) => {
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var accountCreatedAt = moment().format("x");
  var pollsCreated = [];
  var user = new User({
    email,
    username,
    password,
    accountCreatedAt,
    pollsCreated
  });
  user.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.send(e);
  });
});

app.post("/user/login", (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({email}).then((doc) => {
    var validated;
    var errorMsg = "Invalid email or password.";
    if (!doc || doc.password !== password) {
      validated = false;
      errorMsg = "Invalid email or password.";
      res.send({validated, errorMsg});
    } else if (doc.password === password) {
      validated = true;
      var email = doc.email;
      var username = doc.username;
      var _id = doc._id;
      var pollsCreated = doc.pollsCreated;
      res.send({validated, email, username, _id, pollsCreated});
    }

  }).catch((e) => {
    res.send(e);
  });
});


//add user-authenticating middleware. in the middleware, add a 'user' object/string to the req.
app.post("/poll", (req, res, next) => {
  var question = req.body.question;
  var answers = req.body.answers;
  var startedAt = moment().format("x");
  var _creator = req.body._creator;

  var poll = new Poll({question, answers, startedAt, _creator});
  poll.save().then((doc) => {
    User.findOneAndUpdate(
      {_id: _creator},
      {$push: {pollsCreated: doc._id}},
      {new: true}
    ).then((userDoc) => {
      res.send([doc, userDoc]);
    });
  }, (e) => {
    res.send(e);
  });
});

app.get("/poll/all-polls", (req, res) => {
  Poll.find({}).then((docs) => {
    res.send(docs);
  }).catch((e) => {
    res.send(e);
  });
});

app.post("/poll/my-polls", (req, res) => {
  var _creator = req.body._creator;

  Poll.find({_creator}).then((docs) => {
    res.send(docs);
  }).catch((e) => {
    res.send(e);
  });
});

app.post("/poll/view", (req, res) => {
  var _id = req.body.pollId;
  Poll.findOne({_id}).then((doc) => {
    res.send(doc);
  }).catch((e) => {
    res.send(e);
  })
});

app.post("/poll/vote", (req, res) => {
  var answers = req.body.answers;
  var _id = req.body._id;
  Poll.findOneAndUpdate(
    {_id},
    {$set: {answers}},
    {new: true}
  ).then((doc) => {
    res.send(doc);
  }).catch((e) => {
    console.log(e);
    res.send(e);
  });
});

app.post("/poll/remove", (req, res) => {
  var userId = req.body.userId;
  var pollsCreated = req.body.pollsCreated.map((pollId) => ObjectID(pollId));
  var pollId = req.body.pollId;

  User.findOneAndUpdate(
    {_id: userId},
    {$set: {pollsCreated}},
    {new: true}
  ).then((userDoc) => {
    Poll.findOneAndRemove({_id: pollId}).then(() => {
      Poll.find({}).then((pollDocs) => {
        res.send([userDoc, pollDocs]);
      }).catch((e) => {
        console.log(e);
        res.send(e);
      });
    }).catch((e) => {
      console.log(e);
      res.send(e);
    });
  }).catch((e) => {
    console.log(e);
    res.send(e);
  });
  Poll

});

app.listen(port, () => {
  console.log(`Server is live on ${port}`);
});
