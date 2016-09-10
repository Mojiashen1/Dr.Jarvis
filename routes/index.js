var express = require('express');
var router = express.Router();
var Twilio = require('./twilio');
var User = require('../models/models').User;
var Disease = require('../models/models').Disease;

<<<<<<< HEAD
router.get('/', function(req, res, next) {
  res.send('I am ok');
})

/* GET home page. */
router.post('/disease', function(req, res, next) {
  //Praneet's algorithm
  var symptoms = req.query["symptoms"];
  console.log(symptoms)
  var spawn = require("child_process").spawn;
  var process = spawn('python',["./python/S.py", symptoms]);

  var data = ""
  var disease = "";
  process.stdout.on('data', function (data){
    disease += data
  });

  process.on('exit', function()
  {
      console.log("The detected disease is " + disease);
      console.log("Exit code is " + process.exitCode);

      Disease.findOne({"name": disease}, function(err, d) {
        if (err) {
          console.log(err, "err finding disease");
        } else {
          var user = new User({
            disease: d,
            symptom: req.body.symptom,
            phoneNumber: 5083141804
          });
          user.save(function(err, user) {
            if (err) {
              console.log("err saving user", err);
            } else {
              res.send("{'disease': '" + disease + "'}");
            }
          })
        }
      })
  });


});

router.post('/medicine', function(req, res, next) {
  User.findById("57d4790ffef55c151e1aa2e2").populate("disease").exec(function(err, user) {
    console.log('disease', user);
    if (err) {
      console.log(err, "err populating disease");
    } else {
      res.send("{'medicine': '" + user.disease.medicine + "'},{'usage': '" + user.disease.usage + "'}");
    }
  })
});

router.post('/sendMessage', function(req, res, next) {
  var message = req.body.message; // need to construct the message
  var number = req.body.number;
  User.findById("57d4790ffef55c151e1aa2e2").populate("disease").exec(function(err, user) {
    if (err) {
      console.log(err, "err populating disease");
    } else {
      var twilio = Object.create(Twilio);
      twilio.sendMessage(number, "Patrick asked me to send you this: He is feeling " + user.symptom + " , and he is diagnosed with " + user.disease.name + " .\n We recommend him to take " + user.disease.medicine);
      res.send('Sure. I have sent a text message to your doctor');
    }
  })
});



module.exports = router;
