const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
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
	tcrMap.set(id, paramTCR);
	// res.send(tcrMap.get(id));
	// console.log(id);
	res.json(id);
});

app.get('/tcrs/:tcrId', function (req, res) {
	res.json(tcrMap.get(req.body.id));
});

app.delete('/tcrs/:tcrId', function (req, res) {
	tcrMap.delete(req.body.id);
});


app.post('/tcrs/:tcrId/deploy', function (req, res) {
  //Deploy created TCR
});

app.listen(port, () => console.log(`TCR Server app listening on port ${port}!`));
