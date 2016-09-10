var express = require('express');
var router = express.Router();
var twilio = require('./twilio');

/* GET home page. */
router.get('/disease', function(req, res, next) {

  var symptoms = req.query["symptoms"];
  console.log(symptoms)
  var spawn = require("child_process").spawn;
  var process = spawn('python',["S.py", symptoms]);

  var data = ""
  var disease = "";
  process.stdout.on('data', function (data){
    disease += data
  });

  process.on('exit', function()
  {
      console.log("The detected disease is " + disease);
      console.log("Exit code is " + process.exitCode);
      res.send("{disease : '" + disease + "'}");
  });
});

router.get('/sendMessage', function(req, res, next) {
  var message = req.body.message;
  var number = req.body.number;
  twilio.sendTextMessages(number, message);
});

module.exports = router;
