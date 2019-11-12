var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser'); // Addition
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

mongoose.set('useFindAndModify', false); // Options

// Request parser
router.use(bodyParser.urlencoded({extended: true})); // Addition
router.use(bodyParser.json()); // Addition

var UserSchema = new Schema({
	//_id: { type: mongoose.Schema.Types.ObjectId, auto: true}, // New addition
	name: {
		type: String, required: true
	},
	email: {
		type: String, required: true
	},
	address: { type: String },
	phoneNumber: { type: String },
	groups: { type: Array }
});

mongoose.model('User', UserSchema)
var User = require('mongoose').model('User');

var ProjectSchema = new Schema({
	//_id: { type: mongoose.Schema.Types.ObjectId, auto: true}, // New addition
	name: {
		type: String, required: true
	},
	description: {
		type: String, required: true
	},
	type: {
		type: Array, required: true//, enum: [‘Personal’,’Group’] // Add property of enum array [‘Personal’,’Group’]
	},
	members: {
		type: [{type: mongoose.Schema.ObjectId, ref: 'User'}], required: true // Array of User [userIds]
	}
});

mongoose.model('Project', ProjectSchema)
var Project = require('mongoose').model('Project');

var GroupSchema = new Schema({
	//_id: { type: mongoose.Schema.Types.ObjectId, auto: true}, // New addition
	name: { type: String, required: true },
	owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
});

mongoose.model('Group', GroupSchema)
var Group = require('mongoose').model('Group');

// User
// 1
router.post('/user', function (req, res, next) {
	var user = new User(req.body);
	user.save(function (err) {
		if (err) {
			next(err);
		} else {
			res.json({message: 'User successfully created', id: user.id});
			res.status(201);
		}
	});
});

// 2
router.get('/user/:user_id', function (req, res, next) {
	User.findById(req.params.user_id, function (err, user) {
		if (err) {
			next(err);
		} else {
			res.json({id: user._id, name: user.name, email: user.email});
			res.status(200);
		}
	})
});

// 3
router.get('/users', function (req, res, next) {
	if (req.query.groupID) {
		Group.findById(req.query.groupID, function(err, res) {
			if (err) {
				next(err);
			} else {
				res.json(res);
			}
		})
	}
	if (req.query.projectID) {
		Project.findById(req.query.projectID, function(err, res) {
			if (err) {
				next(err);
			} else {
				res.json(res);
			}
		})
	}
});

// 4
router.put('/user/:user_id', function (req, res, next) {
	User.findByIdAndUpdate(req.params.user_id, req.body, function (err, user) {
		if (err) {
			next(err);
		} else {
			res.json({message: 'User successfully updated', id: req.body._id, name: req.body.name, email: req.body.email});
			res.status(200);
		}
	})
});

// 5
router.delete('/user/:user_id', function (req, res, next) {
	User.findByIdAndDelete(req.params.user_id, function (err, user) {
		if (err) {
			next(err);
		} 
		else if (!user) {
			res.json({message: 'User not found'});
			res.status(404); // Vaikko joku muu error?
		} else {
			res.json({message: 'User successfully deleted', id: user._id});
			res.status(200);
		}
	})
});

/*
router.all('/group', function (req, res, next) {
	console.log("hello");
	res.send('group');
});
*/

// Group
// 1
router.post('/group', function (req, res, next) {
	var group = new Group(req.body);
	group.save(function (err) {
		if (err) {
			next(err);
		} else {
			res.json({message: 'Group successfully created', id: group.id});
			res.status(201);
		}
	});
});

// 2
router.get('/group/:group_id', function (req, res, next) {
	Group.findById(req.params.group_id, function (err, group) {
		if (err) {
			next(err);
		} else {
			res.json({id: group._id, name: group.name, owner: group.owner});
		}
	})
});

// 3
router.put('/group/:group_id', function (req, res, next) {
	Group.findByIdAndUpdate(req.params.group_id, req.body, function (err, group) {
		if (err) {
			next(err);
		} else {
			res.json({message: 'Group successfully updated', id: group._id, name: group.name, email: group.email});
		}
	})
});

// 4
router.delete('/group/:group_id', function (req, res, next) {
	Group.findByIdAndDelete(req.params.group_id, function (err, group) {
		if (err) {
			next(err);
		} else if (!group) {
			res.json({message: 'Group not found'});
			res.status(404); // Vaikko joku muu error?
		} else {
			res.json({message: 'Group successfully deleted', id: group._id});
			res.status(200);
		}
	})
});

// 5
router.put('/group/:group_id/:user_id', function (req, res, next) {
	User.findById(req.params.user_id, function (err, user) {
		if (err) {
			next(err);
		} else if (!user) {
			res.json({message: 'User not found'});
			res.status(404);
		} else {
			Group.findByIdAndUpdate(req.params.group_id, req.params, function(err, group) {
				console.log(group);
				if (err) {
					next(err);
				} else if (!group) {
					res.json({message: 'Group not found'});
					res.status(404);
				} else {
					res.json({message: 'User successfully added into a group', id: user._id}); // Also add group to User
					res.status(200);
				}
			})
		}
	})
});

// Project
// 1
router.post('/project', function (req, res, next) {
	var project = new Project(req.body);
	project.save(function (err) {
		if (err) {
			next(err);
		} else {
			res.json({message: 'Project successfully created', id: project.id});
			res.status(201);
		}
	})
});

// 2
router.get('/project/:project_id', function (req, res, next) {
	Project.findById(req.params.project_id, function (err, project) {
		if (err) {
			next(err);
		} else {
			res.json({id: project._id, name: project.name, description: project.description, type: project.type[0], members: project.members});
			res.status(200);
		}
	})
});


module.exports = router;