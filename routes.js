var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

mongoose.set('useFindAndModify', false); // Options

// Request parser
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

// API documentation
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./swagger.yaml');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

// Sensor dataschema
var SensorSchema = new Schema({
	name: { type: String },
	value: { type: String },
	status: { type: String }
});

mongoose.model('Sensor', SensorSchema);
var Sensor = require('mongoose').model('Sensor');

// CORS
/*router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/

// Sensor
// 1 - Create sensor
router.post('/sensor', function (req, res, next) {
	var sensor = new Sensor(req.body);
	sensor.save(function (err) {
		if (!sensor || err) { // Sensor not been created or invalid request
			res.status(400).json({message: 'Invalid request'});
		} else {
			res.status(201).json({message: 'Sensor successfully created', id: sensor.id});			
		}
	});
});

// 2 - Get sensor data
router.get('/sensor/:sensor_id', function (req, res, next) {
	Sensor.findById(req.params.sensor_id, function (err, sensor) {
		if (!sensor || err) { // Sensor not found or invalid request
			res.status(400).json({message: 'Invalid request or sensor id'});
		} else {
			res.status(200).json({id: sensor._id, name: sensor.name, value: sensor.value, status: sensor.status});			
		}
	});
});

// 3 - Update sensor data
router.put('/sensor/:sensor_id', function (req, res, next) {
	Sensor.findByIdAndUpdate(req.params.sensor_id, req.body, function (err, sensor) {
		if (!sensor || err) { // Sensor not found or invalid request
			res.status(400).json({message: 'Invalid request or sensor id'});
		} else if (!req.body.name && !req.body.value && !req.body.status) { // Data or header missing --> no data received
			res.status(400).json({message: 'No data received to update'});
		} else {
			res.status(200).json({message: 'Sensor successfully updated', id: sensor._id, name: req.body.name, value: req.body.value, status: req.body.status});
		}
	});
});

// 4 - Delete sensor
router.delete('/sensor/:sensor_id', function (req, res, next) {
	Sensor.findByIdAndDelete(req.params.sensor_id, function (err, sensor) {
		if (!sensor || err) { // Sensor not found or invalid request
			res.status(400).json({message: 'Invalid request or sensor id'});
		} else {
			res.status(200).json({message: 'Sensor successfully deleted', id: sensor._id});
		}
	});
});

module.exports = router;