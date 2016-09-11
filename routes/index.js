var express = require('express');
var router = express.Router();
var Twilio = require('./twilio');
var User = require('../models/models').User;
var Disease = require('../models/models').Disease;

var Peep = require('../models/models').Peep;


router.get('/', function(req, res, next) {
  res.send('I am ok');
})

/* GET home page. */
router.post('/disease', function(req, res, next) {
  //Praneet's algorithm
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
  var disease;
  if (req.body.symptoms.indexOf('eye') !== -1) {
    disease = 'eye';
  } else if (req.body.symptoms.indexOf('heart') !== -1) {
    disease = 'heart';
  } else if (req.body.symptoms.indexOf('head') !== -1) {
    disease = 'head';
  } else {
    disease = 'sophistication'
  }
  Disease.findOne({"name": disease}, function(err, d) {
    if (err) {
      console.log(err, "err finding disease");
    } else {
      User.findOneAndUpdate({_id: "57d51719e90d340011cc233c"}, {
        disease: d,
        symptom: req.body.symptoms,
        phoneNumber: 5083141804}, function(err, user){
          if (err) {
            console.log("err saving user", err);
          } else {
            if (disease === 'eye') {
              res.send('It seems like you might have a cataract, or an eye infection. Let me know if you need my helping finding the right medicine.')
            } else if (disease === 'heart') {
              res.send('You might have be having a chest pain or a heartache. Let me know if you need my helping finding the right medicine.')
            } else if (disease === 'head') {
              res.send('You might have a headache. Time for some rest? or take some pills. Let me know if you need my helping finding the right medicine.')
            } else {
              res.send('Your symptom sounds sophisticated. I am sure your doctor can help you better.')
            }
          }
        })
      }
    })
  // });
});

router.post('/medicine', function(req, res, next) {
  User.findById("57d51719e90d340011cc233c").populate("disease").exec(function(err, user) {
    console.log('disease', user);
    if (err) {
      console.log(err, "err populating disease");
    } else {
      res.send(user.disease.medicine + ',' + user.disease.usage);
    }
  })
});

router.post('/sendMessage', function(req, res, next) {
  var person;
  if (req.body.person.indexOf('doctor') !== -1) {
    person= 'doctor';
  } else if (req.body.person.indexOf('daughter') !== -1) {
    person= 'daughter';
  } else if (req.body.person.indexOf('son') !== -1) {
    person= 'son';
  } else {
    person= 'indicated person'
  }
  console.log(person, 'person');
  Peep.findOne({"name": person}, function(err, p) {
    console.log('niih', p);
    if (err) {
      console.log(err, 'err finding doctor')
    } else if (p === null) {
      res.send("What's your " + person + "'s name and phone number?");
    } else {
      User.findById("57d51719e90d340011cc233c").populate("disease").exec(function(err, user) {
        console.log('inside else');
        console.log('userrrrr', user);
        if (err) {
          console.log(err, "err populating disease");
        } else {
          var twilio = Object.create(Twilio);
          twilio.sendMessage(p.number, "Hi " + p.name + ", Patrick asked me to send you this: He is feeling " + user.symptom + " , and he is diagnosed with " + user.disease.name + " .\n We recommend him to take " + user.disease.medicine);
          res.send('Sure. I have sent a text message to your ' + person);
        }
      })
    }
  })
});

router.post('/call', function(req, res, next) {
  var person;
  if (req.body.person.indexOf('doctor') !== -1) {
    person= 'doctor';
  } else if (req.body.person.indexOf('daughter') !== -1) {
    person= 'daughter';
  } else if (req.body.person.indexOf('son') !== -1) {
    person= 'son';
  } else {
    person= 'indicated person'
  }
  console.log(person, 'person');
  Peep.findOne({"name": person}, function(err, p) {
    if (err) {
      console.log(err, 'err finding doctor')
    } else if (p === null) {
      res.send("What's your " + person + "'s name and phone number?");
    } else {
      User.findById("57d51719e90d340011cc233c").populate("disease").exec(function(err, user) {
        console.log('userrrrr', user);
        if (err) {
          console.log(err, "err populating disease");
        } else {
          var twilio = Object.create(Twilio);
          twilio.call(p.number);
          res.send('Sure. Calling ' + person + " now");
        }
      })
    }
  })
});


router.post('/person', function(req, res, next){
  var person = new Person({
    name: req.body.name,
    number: req.body.number
  })
  person.save(function(err, p) {
    if (err) {
      console.log('err saving person', err);
    } else {
      //307 makes it redirect to POST
      res.redirect(307, '/sendMessage');
    }
  })
})


module.exports = router;
