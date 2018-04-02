require("dotenv").config();

var request = require('request');
var keys = require('./keys.js');

var Spotify = require('node-spotify-api');

var Twitter = require('twitter');

var fs = require("fs");

var command = process.argv[2];
var search = process.argv[3];


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
function myTweets() {
    var client = new Twitter(keys.twitter);
    client.get('statuses/user_timeline', function (error, tweets, response) {
        if (error) throw error;

        console.log(tweets);
        for (let tweet of tweets) {
            var text = tweet.text;
            let name = tweet.user.screen_name;
            var date = tweet.created_at;
            logStuff(date + name + text);
        }
    });
};


// Spotify
function spotifyThis(whichSearch) {
    var spotify = new Spotify(keys.spotify);
    console.log(whichSearch);
    var params = {
        type: 'track',
        query: whichSearch,
        limit: 1
    };
    spotify.search(params, function (err, data) {
        if (err) return console.log('Error occurred: ' + err);
        var infoToLog = JSON.stringify(data, null, 2);
        logStuff(infoToLog);
    });
}


// omdb
function movieThis(whichSearch) {
    var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&plot=short&t=" + whichSearch;
    request(queryUrl, function (error, response, body) {
        if (error) return console.log('Error occurred: ' + error);
        // var movie = response.Year
        var result = JSON.parse(body);

        var movie = "Movie Title: " + result.Title + "\nYear: " + result.Year +
        "\nIMDB Rating: " + result.Ratings[0].Value + "\nRotten Tomatoes: " + result.Ratings[1].Value + 
        "\nCountry: " + result.Country + "\nLanguage: " + result.Language +
        "\nPlot: " + result.Plot + "\nActors: " + result.Actors +"\n----------";
       
        // var infoToLog = JSON.stringify(response).Title;
        logStuff(movie);
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


commandThis(command, search);