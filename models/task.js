var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var carrierSchema = new mongoose.Schema({
	id: Number,
	subject: String,
	detail: String,
	status: String
});
//{"id":"10","subject":"test","detail":"test","status":"0"}
exports.def =  
	{
		"Task":{
			"id":"Task",
			"required": ["id", "subject"],
			"properties":{
				"id":{
					"type":"integer",
					"format": "int64",
					"description": "Task identifier",
				},
				"subject":{
					"type":"string",
					"description": "Subject of Task"
				},
				"detail":{
					"type":"string",
					"description": "Detail of Task"
				},
				"status":{
					"type":"string",
					"description": "Status of Task"
				}
			}
		}
	};

exports.model = mongoose.model('tasks', carrierSchema);