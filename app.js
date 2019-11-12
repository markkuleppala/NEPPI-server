'use strict';

const express = require('express');
var app = express();

const router = express.Router();
const bodyParser = require('body-parser');
//const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
var path = require('path');

//const swaggerDocument = YAML.load('./swagger.yaml');

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/*
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true });*/

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true });

//const openApiDocumentation = require('./openApiDocumentation');

// Routing
var routes = require('./routes');
app.use('', routes);



//app.use('', router);

app.listen(3000);