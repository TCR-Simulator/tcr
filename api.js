const express = require('express');
const app = express();

app.get('/tcrs/', function (req, res) {
  //Get all TCRs
});

app.post('/tcrs/', function (req, res) {
  //Create a new tcr
	//init_TCR()
});

app.get('/tcrs/:tcrId', function (req, res) {
  //Get TCR by id
});

app.delete('/tcrs/:tcrId', function (req, res) {
  //Delete TCR by id
});


app.post('/tcrs/:tcrId/deploy', function (req, res) {
  //Deploy created TCR
});
