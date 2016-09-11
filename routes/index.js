var express = require('express');
var router = express.Router();
var Twilio = require('./twilio');
var User = require('../models/models').User;
var Disease = require('../models/models').Disease;

var Doctor = require('../models/models').Doctor;


router.get('/', function(req, res, next) {
  res.send('I am ok');
})

/* GET home page. */
router.post('/disease', function(req, res, next) {
  //Praneet's algorithm
  var disease = "Heartache";
  // var symptoms = req.body.symptoms;
  // var spawn = require("child_process").spawn;
  // var process = spawn('python',["./python/S.py", symptoms]);
  //
  // var data = ""
  // var disease = "";
  // process.stdout.on('data', function (data){
  //   disease += data
  // });
  //
  // process.on('exit', function()
  // {
      // console.log("The detected disease is " + disease);
      // console.log("Exit code is " + process.exitCode);

      Disease.findOne({"name": disease}, function(err, d) {
        if (err) {
          console.log(err, "err finding disease");
        } else {
          var user = new User({
            disease: d,
            symptom: req.body.symptoms,
            phoneNumber: 5083141804
          });
          user.save(function(err, user) {
            if (err) {
              console.log("err saving user", err);
            } else {
              res.send(disease);
            }
          })
        }
      })
  // });


});

router.post('/medicine', function(req, res, next) {
  console.log('HI');
  User.findById("57d4790ffef55c151e1aa2e2").populate("disease").exec(function(err, user) {
    console.log('disease', user);
    if (err) {
      console.log(err, "err populating disease");
    } else {
      res.send(user.disease.medicine + ',' + user.disease.usage);
    }
  })
});

router.post('/sendMessage', function(req, res, next) {
  Doctor.findOne({}, function(err, doctor) {
    console.log("hi")
    if (err) {
      console.log(err, 'err finding doctor')
    } else if (doctor === null) {
      res.send("What's your doctor's name and phone number?");
    } else {
      User.findById("57d4790ffef55c151e1aa2e2").populate("disease").exec(function(err, user) {
        if (err) {
          console.log(err, "err populating disease");
        } else {
          var twilio = Object.create(Twilio);
          twilio.sendMessage(doctor.number, "Hi, " + doctor.name + ", Patrick asked me to send you this: He is feeling " + user.symptom + " , and he is diagnosed with " + user.disease.name + " .\n We recommend him to take " + user.disease.medicine);
          res.send('Sure. I have sent a text message to your doctor');
        }
      })
    }
  })

});

router.post('/doctor', function(req, res, next){
  var doctor = new Doctor({
    name: req.body.name,
    number: req.body.number
  })
  doctor.save(function(err, doctor) {
    if (err) {
      console.log('err saving doctor', err);
    } else {
      //307 makes it redirect to POST
      res.redirect(307, '/sendMessage');
    }
  })
})


module.exports = router;
