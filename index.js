module.change_code = 1;
'use strict';

// var request = require('request');
var alexa = require( 'alexa-app' );
var app = new alexa.app( 'reality-editor-skill' );

var PORT = process.env.PORT || 80;
// var io = require('socket.io')(http);
var express_app = require("express")();
var express_server = require('http').Server(express_app);
var io = require('socket.io')(express_server);

express_app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

// app.express({ expressApp: express_app });

app.express({
    expressApp: express_app,

    // verifies requests come from amazon alexa. Must be enabled for production.
    // You can disable this if you're running a dev environment and want to POST
    // things to test behavior. enabled by default.
    checkCert: false,

    // sets up a GET route when set to true. This is handy for testing in
    // development, but not recommended for production. disabled by default
    debug: true
});

express_server.listen(PORT);

console.log("Listening on port " + PORT + ", try http://localhost:" + PORT + "/test");

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

// var express = require('express')();
// var http = require('http').Server(express);
//
// io.on('connection', function(socket){
//     console.log('a user connected');
// });
//
// http.listen(3000, function(){
//     console.log('listening on *:3000');
// });

var state = {
    'RED': 0.0,
    'BLUE': 0.0,
    'GREEN': 0.0
};

app.launch( function( request, response ) {
    response.say( 'Welcome to your reality editor skill' ).reprompt( 'Way to go. You got it to run.' ).shouldEndSession( false );
});

app.error = function( exception, request, response ) {
    console.log(exception)
    console.log(request);
    console.log(response);
    response.say( 'Sorry an error occurred');
};

app.intent('RedOnIntent',
    {
        "utterances": [
            "{Turn|Set} red on",
            "{Turn|Set} on red",
            "{Turn|Set} on the red node",
            "{Turn|Set} the red node on",
            "Start the red node",
            "Start red",
            "red on"]
    },
    function(request, response) {
        handleNewValue('RED', 1.0, response);
    }
);

app.intent('RedOffIntent',
    {
        "utterances": [
            "{Turn|Set} red off",
            "{Turn|Set} off red",
            "{Turn|Set} off the red node",
            "{Turn|Set} the red node off",
            "Stop the red node",
            "Stop red",
            "red off"]
    },
    function(request, response) {
        handleNewValue('RED', 0.0, response);
    }
);

app.intent('GreenOnIntent',
    {
        "utterances": [
            "{Turn|Set} green on",
            "{Turn|Set} on green",
            "{Turn|Set} on the green node",
            "{Turn|Set} the green node on",
            "Start the green node",
            "Start green",
            "green on"]
    },
    function(request, response) {
        handleNewValue('GREEN', 1.0, response);
    }
);

app.intent('GreenOffIntent',
    {
        "utterances": [
            "{Turn|Set} green off",
            "{Turn|Set} off green",
            "{Turn|Set} off the green node",
            "{Turn|Set} the green node off",
            "Stop the green node",
            "Stop green",
            "green off"]
    },
    function(request, response) {
        handleNewValue('GREEN', 0.0, response);
    }
);

app.intent('BlueOnIntent',
    {
        "utterances": [
            "{Turn|Set} blue on",
            "{Turn|Set} on blue",
            "{Turn|Set} on the blue node",
            "{Turn|Set} the blue node on",
            "Start the blue node",
            "Start blue",
            "blue on"]
    },
    function(request, response) {
        handleNewValue('BLUE', 1.0, response);
    }
);

app.intent('BlueOffIntent',
    {
        "utterances": [
            "{Turn|Set} blue off",
            "{Turn|Set} off blue",
            "{Turn|Set} off the blue node",
            "{Turn|Set} the blue node off",
            "Stop the blue node",
            "Stop blue",
            "blue off"]
    },
    function(request, response) {
        handleNewValue('BLUE', 0.0, response);
    }
);

app.intent('CurrentStateIntent',
    {
        "utterances": [
            "which nodes are on",
            "what's happening",
            "get the current state"]
    },
    function(request, response) {
        var speechOutput = '';
        var colors = ['RED', 'GREEN', 'BLUE'];
        colors.forEach(function(color) {
            speechOutput += 'The ' + color + ' node is ' + (state[color] ? 'on' : 'off') + '. ';
        });
        response.say(speechOutput);
    }
);


// END of Intent Handlers ---------------------------------------------------------------------
// Paste in any helper functions below --------------------------------------------------------

function handleNewValue(color, value, response) {

    state[color] = value;

    var speechOutput = "I set the " + color + " node to " + value;
    response.say(speechOutput);


    // httpPost({
    //     "color": color,
    //     "value": value
    // }, function (body) {
    //     var speechOutput = "I set the " + color + " node to " + value;
    //     response.say(speechOutput);
    // });

}

// https is a default part of Node.JS.  Read the developer doc:  https://nodejs.org/api/https.html
// try other APIs such as the current bitcoin price : https://btc-e.com/api/2/btc_usd/ticker  returns ticker.last
// var request = require('request');

// var SERVER_IP = "10.0.1.6";
//
// function httpPost(data, callback) {
//
//     console.log('making post request to ' + 'http://'+SERVER_IP+':3001/newValue with data ' + data.color + ', ' + data.value);
//
//     var options = { method: 'POST',
//         url: 'http://'+SERVER_IP+':3001/newValue',
//         headers:
//             {   'cache-control': 'no-cache',
//                 'content-type': 'application/json' },
//         body: { color: data.color, value: data.value },
//         json: true };
//
//     console.log(options);
//
//     request(options, function (error, response, body) {
//         if (error) throw new Error(error);
//
//         console.log(body);
//
//         callback(body);
//
//         // var speechOutput = "I set the " + data.color + " node to " + data.value;
//         // this.response.speak(speechOutput);
//         // this.emit(':responseReady');
//     });
// }


module.exports = app;