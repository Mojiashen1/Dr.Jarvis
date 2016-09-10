"use strict";
var request = require('request');

//require the Twilio module and create a REST client
var client = require('twilio')(process.env.ACCOUNTID, process.env.AUTHTOKEN);

var twilio= {
  // Assign properties
  apiUrl: "https://api.twilio.com/2010-04-01",
  accountId: process.env.ACCOUNTID,
  authToken: process.env.AUTHTOKEN,
  fromNumber: process.env.FROMNUMBER,


  sendMessage: function(toNumber, messageBody) {
    client.messages.create({
        to: toNumber,
        from: process.env.FROMNUMBER,
        body: messageBody
    }, function(err, message) {
        if (err) console.log('err', err);
    })
  }
}

module.exports=twilio;
