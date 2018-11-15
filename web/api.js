const express = require('express');
const deploy = require('./deploy');
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const stdin = process.openStdin();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


const tcrMap = new Map();

stdin.addListener('data', (d) => {
  console.log(`you entered: ${d.toString()}`);
});

function TcrObject(id, address, name, status, parameters) {
  this.id = id;
  this.address = address;
  this.name = name;
  this.status = status;
  this.contracts = {
    registry: {
      address: '',
      abi: '',
    },
    voting: {
      address: '',
      abi: '',
    },
  };
  this.parameters = parameters;
}

// Get all TCRs
app.get('/tcrs/', (req, res) => {
  // console.log(tcrMap.values());
  res.json(JSON.stringify([...tcrMap]));
});

// Create a new tcr
app.post('/tcrs/', (req, res) => {
  const id = (Math.round((new Date()).getTime() / 1000)).toString();
  // Create new tcr
  const paramTCR = new TcrObject(
    id, '0x234981210434', req.body.name, 'not deployed',
    req.body.parameters,
  );
  // Create a new config file for the tcr and write parameters inside
  const configFilename = `config${paramTCR.id}.json`;
  jsonfile.writeFile(`./conf/${configFilename}`, paramTCR.parameters, (err) => {
    if (err) console.error(err);
  });

  tcrMap.set(id, paramTCR);
  // res.send(tcrMap.get(id));
  // console.log(id);
  res.json(id);
});

app.get('/tcrs/:tcrId', (req, res) => {
  res.json(tcrMap.get(req.params.tcrId));
});

app.delete('/tcrs/:tcrId', (req, res) => {
  const configName = `config${req.params.tcrId}.json`;
  console.log(configName);
  fs.unlink(`./conf/${configName}`, (err) => {
    if (err) console.error(err);
  });
  // tcrMap.delete(req.params.tcrId);
});

// Deploy created TCR
app.post('/tcrs/:tcrId/deploy', (req, res) => {
  console.log(`Deploying tcr - ${JSON.stringify(req.params.tcrId)}`);
  // Get TCR by ID from map
  const paramTCR = tcrMap.get(req.params.tcrId);
  // Get the addresses after deployment
  const deployed = deploy.deployRegistry(req.body.name, req.params);
  // Set the appropriate addresses and abi
  paramTCR.contracts.registry.address = deployed.registry;
  paramTCR.contracts.voting.addres = deployed.plcr;
  // Change deploy status
  paramTCR.status = 'deployed';
});

app.get('/contracts/:contract.json', (req, res) => {
  const contractsDir = path.join(__dirname, '../build/contracts');
  const contract = JSON.parse(fs.readFileSync(`${contractsDir}/${req.params.contract}.json`));
  res.json({
    address: contract.networks.hasOwnProperty('5777') ? contract.networks['5777'].address : null,
    abi: contract.abi,
  });
});

app.listen(port, () => console.log(`TCR Server app listening on port ${port}!`));
