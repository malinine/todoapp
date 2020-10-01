var express = require("express"),
	url = require("url"),
	fs = require('fs'),
	color = require('colors'),
	extras = require('express-extras'),
	api = require('./api.js'),
	util = require('util'),
	bodyParser = require('body-parser');

var app = express(),
	swagger = require('swagger-node-express').createNew(app);
	
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// swagger.addValidator(
// 	function validate(req, path, httpMethod) {
	
// 		if ("POST" == httpMethod || "DELETE" == httpMethod || "PUT" == httpMethod) {
// 			var apiKey = req.headers["api_key"];
// 			if (!apiKey) {
// 				apiKey = url.parse(req.url,true).query["api_key"];
// 			}
// 			if ("1234" == apiKey) {
// 				return true; 
// 			}
// 			return false;
// 		}
// 		return true;
// 	}
// );

var models = {"models":{}},
	modelPath = 'models';
require("fs").readdirSync(modelPath).forEach(function(file) {
    console.log('Load models from - ' + file);
    var outMod = require('./' + modelPath + '/' + file).model;
    for (var atr in outMod) {
        models.models[atr] = outMod[atr];
    }
});
swagger.addModels(models); 


swagger
	.addGet(api.getAllTasks)
	.addPost(api.addTask)
	.addPost(api.updateTask)
	.addGet(api.getTaskById)
	.addDelete(api.deleteTask);


swagger.setApiInfo({
	title: "To-do Application",
	description: "This is a sample To-do API ",
});

swagger.setAuthorizations({
	apiKey: {
		type: "apiKey",
		passAs: "header"
	}
});


swagger.configureSwaggerPaths("", "api-docs", "")
swagger.configure("http://localhost:9999", "1.0.0");

var docs_handler = express.static(__dirname + '/swagger-ui/');
app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
	if (req.url === '/docs') {
		res.writeHead(302, { 'Location' : req.url + '/' });
		res.end();
		return;
	}

	req.url = req.url.substr('/docs'.length);
	return docs_handler(req, res, next);
});

app.listen(9997);


