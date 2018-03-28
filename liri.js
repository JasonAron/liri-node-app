require("dotenv").config();

var request = require('request');
var keys = require('./keys.js');


var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


var Twitter = require('twitter');
var client = new Twitter(keys.twitter);


var fs = require("fs");

var command = process.argv[2];
var search = process.argv[3];


commandThis(command, search);

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

// Twitter
    client.get('statuses/user_timeline', function (error, tweets, response) {
        if (error) throw error;

        for (let tweet of tweets) {
          var text = tweet.text;
          let name = tweet.user.screen_name;
          var date = tweet.created_at;
          logStuff(date + name + text);
        }
    });
}


// Spotify
function spotifyThis(whichSearch) {

    var params = {
        type: 'track',
        query: whichSearch,
        limit: 1
    };

    spotify.search(params, function (err, data) {
      
        if (err) return console.log('Error occurred: ' + err);
        
        var infoToLog = JSON.stringify(body, null, 2);
        logStuff(infoToLog);
    });
}


// omdb
function movieThis(whichSearch) {

    var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&plot=short&t=" + whichSearch;
    request(queryUrl, function (error, response, body) {
        if (error) return console.log('Error occurred: ' + error);

        console.log(body);


        var infoToLog = JSON.stringify(body, null, 2);
        logStuff(infoToLog);
    });
}

// it's brittany bitch
function parseMeBabyOneMoreTime(fileToParse) {
    fs.readFile(fileToParse, "utf8", function (err, data) {
        if (err) return console.log(err);

        var myArray = data.split(",");

        commandThis(myArray[0], myArray[1]);
    });
}

// all the logs
function logStuff(thingsToLog) {
    var logFile = './log.txt';

  fs.appendFile(logFile, ('\n' + thingsToLog), (err) => {
    if (err) throw err;
    console.log('\n' + thingsToLog);
  });
}