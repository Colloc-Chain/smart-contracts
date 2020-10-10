const Landlord = artifacts.require('Landlord');

module.exports = deployer => {
  deployer.deploy(Landlord, 'Leases', 'LSE');
};
