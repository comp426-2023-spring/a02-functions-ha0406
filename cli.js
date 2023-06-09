#!/usr/bin/env node

import minimist from "minimist";
import fetch from "node-fetch";
import moment from "moment-timezone";

const args = minimist(process.argv.slice(2))

if ('h' in args) {
    console.log(`
        Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
            -h            Show this help message and exit.
            -n, -s        Latitude: N positive; S negative.
            -e, -w        Longitude: E positive; W negative.
            -z            Time zone: uses tz.guess() from moment-timezone by default.
            -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
            -j            Echo pretty JSON from open-meteo API and exit.`);
    process.exit(0);
}

// let "vars"
let long;
let lat;

// n
if ('n' in args) {
    lat = args["n"];
} else if ('s' in args) {
    lat = -args["s"];
}

// e
if ('e' in args) {
    long = args["e"];
} else if ('w' in args) {
    long = -args["w"];
}

// quick initial validity check

if (!lat || !long){
    console.log("Latitude must be in range")
    process.exit(0)
}

// more detailed coordinate validity check
if (long == undefined || Math.abs(long) > 180) {
    process.exit(1);
}

if (lat == undefined || Math.abs(lat) > 90) {
    process.exit(1);
}

// timezone
let timezone = moment.tz.guess();
if ('t' in args){
    timezone  =  args['t'];
}

//API request 
let a02url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&daily=precipitation_hours&current_weather=true&timezone=" + timezone;
const response = await fetch(a02url);
let data = await response.json();

//console.log(data):

if("j" in args) {
    console.log(data);
    process.exit(0);
}

let days = args['d']

//log(data)

if (days == 0) {
    console.log("It will rain at the coordinates: " + lat + ", " + long  + data["daily"]["precipitation_hours"][0] + " hours today.\n");
} else if (days > 1) {
    console.log("It will rain at the coordinates: " + lat + ", " + long + data["daily"]["precipitation_hours"][0] + " hours in " + days + " days.\n");
} else {
    console.log("It will rain at coordinates: " + lat + ", " + long + data["daily"]["precipitation_hours"][0] + " hours tomorrow.\n");
}
