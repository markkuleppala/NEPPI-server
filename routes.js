var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser'); // Addition
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

mongoose.set('useFindAndModify', false); // Options

// Request parser
router.use(bodyParser.urlencoded({extended: true})); // Addition
router.use(bodyParser.json()); // Addition


// API documentation
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./swagger.yaml');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));
//

var UserSchema = new Schema({
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
			res.status(201).json({message: 'User successfully created', id: user.id});
		}
	});
});

// 2
router.get('/user/:user_id', function (req, res, next) {
	User.findById(req.params.user_id, function (err, user) {
		if (err) {
			next(err);
		} else {
			res.status(200).json({id: user._id, name: user.name, email: user.email});
		}
	})
});

// 3
router.get('/users', function (req, res, next) {
	console.log("/users");
	console.log(req.query.groupID);
	console.log(req.query.projectID);
	/*
	if (req.query.groupID) {
		Group.findById(req.query.groupID, function (err_g, res_g) {
			console.log("Group");
			console.log(res_g);
			console.log(res_g.owner);
			if (err_g) {
				next(err_g);
			} else {
				res.status(200).json([{'id': res_g.owner}]);
			}
		})
	*/
	if (req.query.groupID) {
		User.find({groups: req.query.groupID}, function (err_u, res_u) {
			console.log("User");
			console.log(res_u);
			if (err_u) {
				next(err_u);
			} else {
				res.status(200).json([{'id': res_u[0]._id}]);
			}
		})
	} else if (req.query.projectID) {
		Project.findById(req.query.projectID, function (err_p, res_p) {
			if (err_p) {
				next(err_p);
			} else {
				res.status(200).json([{'id': res_p.members[0]}]);
			}
		})
	} else {
		next(err);
	}
});

// 4
router.put('/user/:user_id', function (req, res, next) {
	User.findByIdAndUpdate(req.params.user_id, req.body, function (err, user) {
		if (err) {
			next(err);
		} else {
			res.status(200).json({message: 'User successfully updated', id: user._id, name: req.body.name, email: req.body.email});
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
			res.status(404).json({message: 'User not found'}); // Vaikko joku muu error?
		} else {
			res.status(200).json({message: 'User successfully deleted', id: user._id});
		}
	})
});

// Group
// 1
router.post('/group', function (req, res, next) {
	var group = new Group(req.body);
	group.save(function (err) {
		if (err) {
			next(err);
		} else {
			res.status(201).json({message: 'Group successfully created', id: group.id});
		}
	});
});

// 2
router.get('/group/:group_id', function (req, res, next) {
	Group.findById(req.params.group_id, function (err, group) {
		if (err) {
			next(err);
		} else {
			res.status(200).json({id: group._id, name: group.name, owner: group.owner});
		}
	})
});

// 3
router.put('/group/:group_id', function (req, res, next) {
	Group.findByIdAndUpdate(req.params.group_id, req.body, function (err, group) {
		if (err) {
			next(err);
		} else {
			res.status(200).json({message: 'Group successfully updated', id: group._id, name: req.body.name, owner: req.body.owner});
		}
	})
});

// 4
router.delete('/group/:group_id', function (req, res, next) {
	Group.findByIdAndDelete(req.params.group_id, function (err, group) {
		if (err) {
			next(err);
		} else if (!group) {
			res.status(404).json({message: 'Group not found'}); // Vaikko joku muu error?
		} else {
			res.status(200).json({message: 'Group successfully deleted', id: group._id});
		}
	})
});

// 5
router.put('/group/:group_id/:user_id', function (req, res, next) {
/*
	User.findById(req.params.user_id, function (err, user) {
		if (err) {
			next(err);
		} else if (!user) {
			res.status(404).json({message: 'User not found'});
		} else {
			Group.findByIdAndUpdate(req.params.group_id, req.params, function(err, group) {
				console.log(group);
				if (err) {
					next(err);
				} else if (!group) {
					res.status(404).json({message: 'Group not found'});
				} else {
					res.status(200).json({message: 'User successfully added into a group', id: user._id}); // Also add group to User
				}
			})

		}
	})
*/
	User.findByIdAndUpdate(req.params.user_id, {$push: {groups: req.params.group_id}}, function (err, user) {
		console.log("Add user to group");
		console.log("req.params");
		console.log(req.params);
		console.log("user");
		console.log(user);
		if (err) {
			next(err);
		} else if (!user) {
			res.status(404).json({message: 'User not found'});
		} else {
			res.status(200).json({message: 'User successfully added into a group', id: user._id});
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
			res.status(201).json({message: 'Project successfully created', id: project.id});
		}
	})
});

// 2
router.get('/project/:project_id', function (req, res, next) {
	Project.findById(req.params.project_id, function (err, project) {
		if (err) {
			next(err);
		} else if (!project) {
			res.status(404).json({message: 'Project not found'});
		} else {
			res.status(200).json({id: project._id, name: project.name, description: project.description, type: project.type[0], members: project.members});
		}
	})
});

// 3
router.put('/project/:project_id', function (req, res, next) {
	Project.findByIdAndUpdate(req.params.project_id, req.body, function (err, project) {
		if (err) {
			next(err);
		} else {
			res.status(200).json({message: 'Project successfully updated', id: project._id, name: req.body.name, description: req.body.description, type: req.body.type, members: req.body.members});
		}
	})
});

// 4
router.delete('/project/:project_id', function (req, res, next) {
	Project.findByIdAndDelete(req.params.project_id, function (err, project) {
		if (err) {
			next(err);
		} else if (!project) {
			res.status(404).json({message: 'Project not found'});
				
		} else {
			res.status(200).json({message: 'Project successfully deleted', id: project._id});
		}
	})
});

module.exports = router;