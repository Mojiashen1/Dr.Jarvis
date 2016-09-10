var express = require('express');
var router = express.Router();
var Twilio = require('./twilio');
var User = require('../models/models').User;
var Disease = require('../models/models').Disease;

router.get('/', function(req, res, next) {
  res.send('I am ok');
})

/* GET home page. */
router.post('/disease', function(req, res, next) {
  //Praneet's algorithm
  var disease = 'Heartache';
  disease.findOne({"name": disease}, function(err, d) {
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
          res.send("{'disease': '" + user.disease + "'}");
        }
      })
    }
  })
});

router.post('/medicine', function(req, res, next) {
  var message = req.body.message;
  var number = req.body.number;
//return the medicine
  var twilio = Object.create(Twilio);
  twilio.sendMessage(number, message);
  res.send('ok');
});

router.post('/sendMessage', function(req, res, next) {
  var message = req.body.message; // need to construct the message
  var number = req.body.number;

  var twilio = Object.create(Twilio);
  twilio.sendMessage(number, message);
  res.send('Sure...');
});



module.exports = router;
