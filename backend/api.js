const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const port = 3000;
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');
const database = require('./database');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var tcrMap = new Map();

function tcrObject(id, address, name, status, abi, parameters) { 
	this.id = id;
	this.address = address;
	this.name = name;
	this.status = status;
	this.abi = abi;
	this.parameters = parameters;
}

/* Get all TCRs */
app.get('/tcrs/', function (req, res) {
	res.json(JSON.stringify([...tcrMap]));
});

/* Create a new tcr */
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

/* Get the TCR associated with the tcrId */
app.get('/tcrs/:tcrId', function (req, res) {
	res.json(tcrMap.get(req.params.tcrId));
});

/* Delete the TCR associated with the tcrId*/
app.delete('/tcrs/:tcrId', function (req, res) {
	const config_name = 'config' + req.params.tcrId + '.json';
	var tcrObj = tcrMap.get(req.params.tcrId);
	// tcrMap.delete(req.params.tcrId);
	database.deleteTCR(tcrObj.name, function() {
	  res.json(req.params.tcrId);
	});
});

/* Deploy created TCR */
app.post('/tcrs/:tcrId/deploy', function (req, res) {
	console.log("Deploying tcr - " + JSON.stringify(req.params.tcrId));
	const config_filepath = './conf/config' + JSON.stringify(req.params.tcrId) + '.json';
});

/* Add songs to a TCR */
app.post('/tcrs/:tcrId/listings', function (req, res) {
	var tcrObj = tcrMap.get(req.params.tcrId)
	database.addListing(tcrObj.name, req.body.songs, function() {
	  res.json(tcrObj.id);
	});
});

/* Get all songs associated with the given TCR */
app.get('/tcrs/:tcrId/listings', function(req, res) {
	var tcrObj = tcrMap.get(req.params.tcrId)
  database.getListings(tcrObj.name).then((result) => {
	  res.json(result);
	});
});

/* Update fields of a song */
app.put('/tcrs/:tcrId/listings', function(req, res) {
	var tcrObj = tcrMap.get(req.params.tcrId)
  database.updateSong(tcrObj.name, req.body.song.id, req.body.song, function() {
	  res.json(tcrObj.id);
	}); 
});


app.listen(port, () =>console.log(`TCR Server app listening on port ${port}!`));
