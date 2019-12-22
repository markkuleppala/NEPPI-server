'use strict';

const port = 3000;

// Use ExpressJS as router
const express = require('express');
var app = express();

// Allow all CORS requests - Access-Control-Allow-Origin: *
var cors = require('cors');
app.use(cors());

// Use MongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://mongo:27017/db', {useNewUrlParser: true, useUnifiedTopology: true }); // Docker environment

// Routing
var routes = require('./routes');
app.use('', routes);

// Listen to port
app.listen(port, function() {
    console.log(`Listening on ${port}`);
});