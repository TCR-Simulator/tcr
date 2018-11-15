/* global artifacts web3 */
const fs = require('fs');

const RegistryFactory = artifacts.require('RegistryFactory.sol');
const TestToken = artifacts.require('TestToken.sol');

/**
 * Deploy a registry with the specified config. The deployed registry uses TestToken.
 * @param {string} networkID Network to deploy to.
 * @param {string} name Name of the TCR to be created.
 * @param {object} parameters Parameters to initiate the TCR with.
 * @return {object} An object containing the addresses of the creator, token, plcr, parameterizer,
 *                  and registry.
 */
async function deployRegistryToNetwork(networkID, name, parameters) {
  let registryFactoryAddress;
  if (networkID === '1') {
    registryFactoryAddress = '0xcc0df91b86795f21c3d43dbeb3ede0dfcf8dccaf'; // mainnet
  } else if (networkID === '4') {
    registryFactoryAddress = '0x2bddfc0c506a00ea3a6ccea5fbbda8843377dcb1'; // rinkeby
  } else {
    registryFactoryAddress = RegistryFactory.address; // development
  }

  const testTokenAddress = TestToken.address;
  const registryFactory = await RegistryFactory.at(registryFactoryAddress);
  const registryReceipt = await registryFactory.newRegistryBYOToken(
    testTokenAddress,
    [
      parameters.minDeposit,
      parameters.pMinDeposit,
      parameters.applyStageLength,
      parameters.pApplyStageLength,
      parameters.commitStageLength,
      parameters.pCommitStageLength,
      parameters.revealStageLength,
      parameters.pRevealStageLength,
      parameters.dispensationPct,
      parameters.pDispensationPct,
      parameters.voteQuorum,
      parameters.pVoteQuorum,
      parameters.exitTimeDelay,
      parameters.exitPeriodLen,
    ],
    name,
  );

  return registryReceipt.logs[0].args;
}
/**
 * Deploy a registry with the specified config. The deployed registry uses TestToken. This method
 * will automatically select the current network.
 * @param {string} name Name of the TCR to be created.
 * @param {object} parameters Parameters to initiate the TCR with.
 * @return {object} An object containing the addresses of the creator, token, plcr, parameterizer,
 *                  and registry.
 */
async function deployRegistry(name, parameters) {
  return new Promise((resolve, reject) => {
    web3.version.getNetwork((err, network) => {
      if (err) {
        return reject(err);
      }

      return deployRegistryToNetwork(network, name, parameters)
        .then(result => resolve(result));
    });
  });
}

module.exports = (done) => {
  const configFile = process.argv[process.argv.length - 1];
  console.log(`Using config file: ${configFile}`); // eslint-disable-line no-console
  const config = JSON.parse(fs.readFileSync(configFile));
  const { name, paramDefaults } = config;
  return deployRegistry(name, paramDefaults).then((result) => {
    console.log(result); // eslint-disable-line no-console
    return done();
  });
};
