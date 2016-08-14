var mongoose = require('mongoose'),
	sw = require('swagger-node-express'),
	colors = require('colors'),
	swe = sw.errors,
	config = require('./config'),
	util = require('util'),
	db = mongoose.connection;

db.on('error', function() {
	console.log('Database connection error'.red);
});
db.on('connecting', function () {
	console.log('Database connecting'.cyan);
});
db.once('open', function() {
	console.log('Database connection established'.green);
});
db.on('reconnected', function () {
	console.log('Database reconnected'.green);
});

mongoose.connect(config.db_url, {server: {auto_reconnect: true}});

var Task = require('./models/task.js');

exports.getAllTasks = {
	'spec': {
		description : "List all Tasks",
		path : "/task/list",
		method: "GET",
		summary : "List all Tasks",
		notes : "Returns a list of all Task",
		type : "Carrier",
		nickname : "getAllTasks",
		produces : ["application/json"],
		parameters : [],
		responseMessages : [swe.invalid('tasks'), swe.notFound('tasks')]
	},
	'action': function (req,res) {
		Task.model.find(function(err, carriers) {
			if (err) return next(swe.invalid('tasks'))

			if (carriers) {
				res.send(carriers);
			} else {
				res.send(404, swe.notFound('tasks'));
			};
		});
	}
};

exports.addTask = {
	'spec': {
		path : "/task",
		notes : "Adds a new task",
		summary : "Add a new task",
		method: "POST",
		parameters : [{			
			name: "Carrier name",
			description: "JSON object representing the task to add",
			required: true,
			type: "Task",
			paramType: "body"
		}],
		responseMessages : [swe.invalid('input')],
		nickname : "addTask"
	},
	'action': function(req, res, next) {
		var body = req.body;
		console.log(body);
		if(!body || !body.subject){
			throw swe.invalid('subject name');
		} else {
			
			Task.model.create({subject: body.subject,detail: body.detail,status: body.status}, function (err, name) {
				if (err) return res.send(500, { error: err });
				if (name) {
					res.send(name);
				} else {
					res.send(500, { error: 'task can not add' });
				};
			});
		}
	}
};

exports.updateTask = {
	'spec': {
		path : "/task/update",
		notes : "Update an existing task",
		summary : "Update an existing task",
		method: "POST",
		parameters : [{
			name: "Task",
			description: "JSON object representing the task to update",
			required: true,
			type: "Task",
			paramType: "body"
		}],
		responseMessages : [swe.invalid('input')],
		nickname : "updateTask"
	},
	'action': function(req, res, next) {
		var body = req.body;
		console.log(body);
		if(!body || !body.id) {
			throw swe.invalid('invalid Id');
		} else if(!body || !body.subject) {
			throw swe.invalid('invalid Subject');
		} else {
			
			Task.model.update({ _id : body.id}, { detail: body.detail , status: body.status }, function (err, numRowsAffected, raw) {
				if (err) return res.send(500, { error: err });
				console.log(numRowsAffected);
				if (numRowsAffected.n > 0) {
					res.send(raw);
				} else {
					res.send(500, { error: 'task can not update' });
				};
			});
		}
	}
};

exports.getTaskById = {
	'spec': {
		description : "Operations about carriers",
		path : "/task/{Id}",
		method: "GET",
		summary : "Find task by ID",
		notes : "Returns Task based on ID",
		type : "Task",
		nickname : "getTaskById",
		produces : ["application/json"],
		parameters : [sw.pathParam("Id", "ID of the carrier to return", "string")],
		responseMessages : [swe.invalid('id'), swe.notFound('task')]
	},
	'action': function (req,res) {
		Task.model.findOne({_id: req.params.Id}, function(err, task) {
			if (err) return res.send(404, { error: 'invalid id' });

			if (task) {
				res.send(task);
			} else {
				res.send(404, new Error('carrier not found'));
			}
		});
	}
};

exports.deleteTask = {
	'spec': {
		path : "/task/{Id}",
		notes : "Delete an existing task",
		summary : "Delete an existing task",
		method: "DELETE",
		parameters : [sw.pathParam("Id", "Taks ID to delete", "string")],
		responseMessages : [swe.invalid('input')],
		nickname : "deleteTak"
	},
	'action': function(req, res) {
		Task.model.remove({ _id : req.params.Id }, function (err) {
			if (err) return res.send(500, { error: err });

			res.status(200).send({ 'msg' : 'ok' });
		});
	}
};

