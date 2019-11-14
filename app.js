'use strict';

const express = require('express');
var app = express();

const router = express.Router();
const bodyParser = require('body-parser');
var path = require('path');

//mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true });

var mongoose = require('mongoose');
mongoose.connect('mongodb://mongo:27017/db', {useNewUrlParser: true, useUnifiedTopology: true }); // Docker environment
//mongoose.connect('mongodb://localhost:27107/db', {useNewUrlParser: true, useUnifiedTopology: true }); // Local environment

// Routing
var routes = require('./routes');
app.use('', routes);

app.listen(3000);