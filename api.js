const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');
const cmd = require('node-cmd');
const stdin = process.openStdin();
const fs = require('fs');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


var tcrMap = new Map();

stdin.addListener("data", function(d) {
	console.log("you entered: " + d.toString());
});

function tcrObject(id, address, name, status, abi, parameters) { 
	this.id = id;
	this.address = address;
	this.name = name;
	this.status = status;
	this.abi = abi;
	this.parameters = parameters;
}

//Get all TCRs
app.get('/tcrs/', function (req, res) {
	// console.log(tcrMap.values());
	res.json(JSON.stringify([...tcrMap]));
});

//Create a new tcr
app.post('/tcrs/', function (req, res) {
	var id = (Math.round((new Date()).getTime() / 1000)).toString();
	var paramTCR = new tcrObject(id, "0x234981210434", req.body.name, "yet to be deployed",
		"abi",req.body.parameters);

	// Create a new config file for the tcr and write parameters inside
	const config_filename = 'config' + paramTCR.id + '.json';
	jsonfile.writeFile('./conf/' + config_filename, paramTCR.parameters, function(err) {
		if (err) console.error(err);
	});
	
	tcrMap.set(id, paramTCR);
	// res.send(tcrMap.get(id));
	// console.log(id);
	res.json(id);
});

app.get('/tcrs/:tcrId', function (req, res) {
	res.json(tcrMap.get(req.params.tcrId));
});

app.delete('/tcrs/:tcrId', function (req, res) {
	const config_name = 'config' + req.params.tcrId + '.json';
	console.log(config_name);
	fs.unlink('./conf/' + config_name, (err) => {
		if (err) console.error(err);
	});
	// tcrMap.delete(req.params.tcrId);
});

//Deploy created TCR
app.post('/tcrs/:tcrId/deploy', function (req, res) {
	console.log("Deploying tcr - " + JSON.stringify(req.params.tcrId));
	const config_filepath = './conf/config' + JSON.stringify(req.params.tcrId) + '.json';

	//TODO: find the argv index for config_filename, then you can use process.argv[3] to pass this config file.
	cmd.run('npm run deploy-proxies:ganache -- ' + config_filepath);
	
});

app.listen(port, () => console.log(`TCR Server app listening on port ${port}!`));
