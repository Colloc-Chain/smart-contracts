const Leases = artifacts.require('Leases');

module.exports = deployer => {
  deployer.deploy(Leases, 'Leases', 'LSE');
};
