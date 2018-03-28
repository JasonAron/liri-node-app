// Require environment variables
require("dotenv").config();
var keys = require('./keys.js');

// Require Spotify API, add .env
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// Require Twitter API, add .env
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);

// Require Node.js 'file system' module
var fs = require("fs");

/**
 *  Logic of program below
 */

// Store value of user arguments given
var command = process.argv[2]; // -> Which command was given?
var search = process.argv[3]; // -> Which search term was requested?

// Call function that matches value of 'command' arg passed
commandThis(command, search);

// Match the value of the command to the appropriate function calls
function commandThis(whichCommand, whichSearch) {
    if (whichCommand == "my-tweets") {
        myTweets();
    }
    if (whichCommand == "spotify-this-song") {
        spotifyThis(whichSearch);
    }
    if (whichCommand == "movie-this") {
        movieThis(whichSearch);
    }
    if (whichCommand == "do-what-it-says") {
        var fileToParse = './random.txt';
        parseMeBabyOneMoreTime(fileToParse);
    }
}

function myTweets() {
    // ... call Twitter API - https://www.npmjs.com/package/twitter
    client.get('statuses/user_timeline', function (error, tweets, response) {
        // Handle errors
        if (error) throw error;
        // If no errors thrown
        console.log(tweets); // All my tweets
        // Then log stuff
        var infoToLog; // Put tweets inside of this variable
        logStuff(infoToLog);
    });
}

function spotifyThis(whichSearch) {
    // ... call Spotify API - https://www.npmjs.com/package/node-spotify-api
    // Query Parameters
    var params = {
        type: 'track',
        query: whichSearch
    };

    spotify.search(params, function (err, data) {
        // Handle errors
        if (err) return console.log('Error occurred: ' + err);

        console.log(data);

        // Then log stuff
        var infoToLog; // Put tweets inside of this variable
        logStuff(infoToLog);
    });
}

function movieThis(whichSearch) {
    // ... call OMDB API - https://www.npmjs.com/package/request
    // http://www.omdbapi.com/

    // HINT: -> whichSearch <- was just passed in as 'The Lion King'
    var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&plot=short&t=" + whichSearch;
    request(queryUrl, function (error, response, body) {
        if (error) return console.log('Error occurred: ' + error);

        console.log(body);

        // Then log stuff
        var infoToLog; // Put tweets inside of this variable
        logStuff(infoToLog);
    });
}

function parseMeBabyOneMoreTime(fileToParse) {
    // ... read fileToParse - https://nodejs.org/docs/latest-v9.x/api/fs.html#fs_fs_readfile_path_options_callback
    fs.readFile(fileToParse, "utf8", function (err, data) {
        if (err) return console.log(err);

        // Break the string down by comma separation and store the contents into the output array.
      var myArray = data.split(",");

      // then re-call commandThis()
      commandThis(myArray[0], myArray[1]);
    });
}

function logStuff(thingsToLog) {
    var logFile = './log.txt';
    // ... log to file - https://nodejs.org/docs/latest-v9.x/api/fs.html#fs_fs_appendfile_file_data_options_callback

  fs.appendFile(logFile, thingsToLog, (err) => {
    if (err) throw err;
    console.log(thingsToLog);
  });
}