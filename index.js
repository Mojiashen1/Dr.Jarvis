// This code sample shows how to call and receive external rest service data, within your skill Lambda code.

// var AWS = require('aws-sdk');

var https = require('https');

exports.handler = function( event, context ) {
    var say = "";
    var shouldEndSession = false;
    var sessionAttributes = {};
    var myState = "";
    var pop = " ";
    var pop2 = " ";
    var rank = 0;
    
    if (event.session.attributes) {
        sessionAttributes = event.session.attributes;
    }
    
    if (event.request.type === "LaunchRequest") {
        say = "Doctor Jarvis Welcomes you";
        context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
        
    } else {
        var IntentName = event.request.intent.name;
        
        if (IntentName === "PainIntent") {
            
            if (event.request.intent.slots.body_parts.value) {
                
                myState = event.request.intent.slots.body_parts.value;
                
                
                // call external rest service over https post
                var post_data = {"symptoms": myState};
                
                
                
                var post_options = {
                    
                host:  'drjavis.herokuapp.com',
                    
                port: '443',
                    
                path: '/disease',
                    
                method: 'POST',
                    
                headers: {
                    
                    'Content-Type': 'application/json',
                    
                    'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
                    
                }
                };
                
                
                var post_req = https.request(post_options, function(res) {
                                             
                                             res.setEncoding('utf8');
                                             
                                             var returnData = "";
                                             
                                             res.on('data', function (chunk) {
                                                    
                                                    returnData += chunk;
                                                    
                                                    });
                                             
                                             res.on('end', function () {
                                                    // returnData: {"usstate":"Delaware","attributes":[{"population":900000},{"rank":45}]}
                                                    
                                                    pop = JSON.stringify(returnData)["disease"];
                                                    
                                                    say = " It looks like you have a  " + pop;
                                                    
                                                    // add the state to a session.attributes array
                                                    if (!sessionAttributes.requestList) {
                                                    sessionAttributes.requestList = [];
                                                    }
                                                    sessionAttributes.requestList.push(myState);
                                                    
                                                    // This line concludes the lambda call.  Move this line to within any asynchronous callbacks that return and use data.
                                                    context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
                                                    
                                                    });
                                             
                                             
                                             });
                
                
                post_req.write(JSON.stringify(post_data));
                
                post_req.end();
                
            }
            
        } else if (IntentName === "AMAZON.StopIntent" || IntentName === "AMAZON.CancelIntent") {
            
            //        var speechOutput = "Goodbye";
            //   response.tell(speechOutput);
            say = "Goodbye";
            shouldEndSession = true;
            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
            
            
        } else if (IntentName === "AMAZON.HelpIntent" ) {
            say = "State your symptons"
            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
            
        }
        
        else if (IntentName === "ReportIntent"){
            
            
            // call external rest service over https post
            //var post_data = {"symptoms": myState};
            
            
            
            var post_options = {
                
            host:  'drjavis.herokuapp.com',
                
            port: '443',
                
            path: '/sendmessage',
                
            method: 'POST',
                
            headers: {
                
                'Content-Type': 'application/json',
                
                'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
                
            }
            };
            
            
            var post_req = https.request(post_options, function(res) {
                                         
                                         res.setEncoding('utf8');
                                         
                                         var returnData = "";
                                         
                                         res.on('data', function (chunk) {
                                                
                                                returnData += chunk;
                                                
                                                });
                                         
                                         res.on('end', function () {
                                                // returnData: {"usstate":"Delaware","attributes":[{"population":900000},{"rank":45}]}
                                                
                                                pop = JSON.stringify(returnData).report;
                                                
                                                say = pop;
                                                
                                                // add the state to a session.attributes array
                                                if (!sessionAttributes.requestList) {
                                                sessionAttributes.requestList = [];
                                                }
                                                sessionAttributes.requestList.push(myState);
                                                
                                                // This line concludes the lambda call.  Move this line to within any asynchronous callbacks that return and use data.
                                                context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
                                                
                                                });
                                         
                                         
                                         });
            
            //post_req.write(JSON.stringify(post_data));
            
            post_req.end();
        }
        
        else if (IntentName === "MedicineIntent"){
            
            if (event.request.intent.slots.disease.value) {
                
                myState = event.request.intent.slots.disease.value;
                
                
                // call external rest service over https post
                var post_data = {"symptoms": myState};
                
                
                
                var post_options = {
                    
                host:  'drjavis.herokuapp.com',
                    
                port: '443',
                    
                path: '/medicine',
                    
                method: 'POST',
                    
                headers: {
                    
                    'Content-Type': 'application/json',
                    
                    'Content-Length': Buffer.byteLength(JSON.stringify(post_data))
                    
                }
                };
                
                
                var post_req = https.request(post_options, function(res) {
                                             
                                             res.setEncoding('utf8');
                                             
                                             var returnData = "";
                                             
                                             res.on('data', function (chunk) {
                                                    
                                                    returnData += chunk;
                                                    
                                                    });
                                             
                                             res.on('end', function () {
                                                    // returnData: {"usstate":"Delaware","attributes":[{"population":900000},{"rank":45}]}
                                                    pop = JSON.stringify(returnData).medicine; 
                                                    pop2 = JSON.stringify(returnData).usage;
                                                    //
                                                    say = "The medicine is  " + pop + "and the usage is " + pop2;
                                                    
                                                    // add the state to a session.attributes array
                                                    if (!sessionAttributes.requestList) {
                                                    sessionAttributes.requestList = [];
                                                    }
                                                    sessionAttributes.requestList.push(myState);
                                                    
                                                    // This line concludes the lambda call.  Move this line to within any asynchronous callbacks that return and use data.
                                                    context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });
                                                    
                                                    });
                                             
                                             
                                             });
                
                
                post_req.write(JSON.stringify(post_data));
                
                post_req.end();
                
            }
            
            
        }
    }
};

function buildSpeechletResponse(say, shouldEndSession) {
    return {
    outputSpeech: {
    type: "SSML",
    ssml: "<speak>" + say + "</speak>"
    },
    reprompt: {
    outputSpeech: {
    type: "SSML",
    ssml: "<speak>Please try again. " + say + "</speak>"
    }
    },
    card: {
    type: "Simple",
    title: "My Card Title",
    content: "My Card Content, displayed on the Alexa App or alexa.amazon.com"
    },
    shouldEndSession: shouldEndSession
    };
}