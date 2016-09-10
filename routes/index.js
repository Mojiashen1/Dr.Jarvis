var express = require('express');
var router = express.Router();
var twilio = require('./twilio');

/* GET home page. */
router.get('/disease', function(req, res, next) {
  res.send("{'disease': '" + req.query.disease + "'}");
});

router.get('/sendMessage', function(req, res, next) {
  var message = req.body.message;
  var number = req.body.number;
  twilio.sendTextMessages(number, message);
});


module.exports = router;
