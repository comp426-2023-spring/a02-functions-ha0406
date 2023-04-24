#!/usr/bin/env node

import minimist from "minimist";
import fetch from "node-fetch";
import moment from "moment-timezone";

const args = minimist(process.argv.slice(2));

// -h
if (args.h) {
  console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`)
    process.exit(0);
}

const timezone = moment.tz.guess();

let latitude;
let longitude;
let timezone_1;

if (args.n) {
    latitude = args.n;
} else if (args.s) {
    latitude = -args.s;  
} else {
    console.log("Latitude must be in range");
    process.exit(0);
}

if (args.e) {
    longitude = args.e;
} else if (args.w) {
    longitude = -args.w;
} else {
    console.log("Longitude must be in range");
    process.exit(0);
}

if (args.z) {
    timezone_1 = args.z;
} else {
    timezone_1 = timezone
}

longitude = Math.round(longitude);
latitude = Math.round(latitude);

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&current_weather=true&timezone=' + timezone_l);)

const data = await response.json();

const days = args.d

if (days == 0) {
    console.log("today.")
} else if (days > 1) {
    console.log("in " + days + " days.")
} else {
    console.log("tomorrow")
}

if (args.j) {
    console.log(data)
    process.exit
}
