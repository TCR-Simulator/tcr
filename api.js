const express = require('express');
const app = express();
const port = 3000;

app.get('/tcrs/', function (req, res) {
  //Get all TCRs
	res.send('Hello World!');
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

app.listen(port, () => console.log(`TCR Server app listening on port ${port}!`));
