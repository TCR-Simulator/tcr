const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const port = 3000;
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');
const cmd = require('node-cmd');
const fs = require('fs');
const database = require('./database');
const uri = "mongodb+srv://softeng18:" + process.env.SOFTENG_MONGODB_PASSWORD + "@musicmap-caf2e.mongodb.net/test?retryWrites=true"

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var tcrMap = new Map();

const list = [
  { id: "1", title: "Kill me Now - By Ece", status: "accepted", url: "www.killmenow.com", listingHash: "123", challengeHash: "456" },
{ id: "1", title: "Wow it is working - By Ece", status: "rejected", url: "www.killmenow.com", listingHash: "123", challengeHash: "456" }
  
]

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
	res.json(JSON.stringify([...tcrMap]));
});

//Create a new tcr
app.post('/tcrs/', function (req, res) {
	var id = (Math.round((new Date()).getTime() / 1000)).toString();
	var paramTCR = new tcrObject(id, "0x234981210434", 
					                     req.body.name, "yet to be deployed",
		                           "abi",req.body.parameters);
  tcrMap.set(id, paramTCR);
  database.createRegistry(paramTCR.name, function() {
	  res.json(paramTCR.id);
	});
});

app.get('/tcrs/:tcrId', function (req, res) {
	res.json(tcrMap.get(req.params.tcrId));
});

app.delete('/tcrs/:tcrId', function (req, res) {
	const config_name = 'config' + req.params.tcrId + '.json';
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

// Get the listings associated with the given tcrId from the database
app.get('/tcrs/:tcrId/addListing', function (req, res) {
	var tcrObj = tcrMap.get(req.params.tcrId)
	database.addListing(tcrObj.name, list, function(res) {
	  console.log("Getting the listings");
	});
});

app.get('/tcrs/:tcrId/listings', function(req, res) {
	var tcrObj = tcrMap.get(req.params.tcrId)
  database.getListings("TCR7", function(result) {
		console.log("Helloo:==========");
		console.log(result);
	  res.json(result);
	});
});

app.listen(port, () =>console.log(`TCR Server app listening on port ${port}!`));
