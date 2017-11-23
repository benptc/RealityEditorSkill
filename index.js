module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var app = new alexa.app( 'reality-editor-skill' );


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
            "red on"]
    },
    function(request, response) {
        response.say('I turned on the red node');
    }
);

module.exports = app;