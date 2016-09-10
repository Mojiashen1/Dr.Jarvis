var express = require('express');
var router = express.Router();
var Twilio = require('./twilio');
var User = require('../models/models').User;
var Disease = require('../models/models').Disease;



/* GET home page. */
router.post('/disease', function(req, res, next) {
  var disease = new Disease({
    name: req.body.diseaseName,
    symptom: req.body.symptom,
    medicine: req.body.medicine
  })
  disease.save(function(err, user) {
    if (err)
      console.log("err saving disease", err);
  })
  var user = new User({
    disease: disease
  });
  user.save(function(err, user) {
    if (err) {
      console.log("err saving user", err);
    } else {
      res.send("{'disease': '" + user.desease + "'}");
    }
  })
});

router.post('/sendMessage', function(req, res, next) {
  var message = req.body.message;
  var number = req.body.number;

  var twilio = Object.create(Twilio);
  twilio.sendMessage(number, message);
  res.send('ok');
});


module.exports = router;
