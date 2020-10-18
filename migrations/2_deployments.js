const CLCToken = artifacts.require('CLCToken');
const Landlord = artifacts.require('Landlord');

module.exports = async deployer => {
  await deployer.deploy(Landlord, 'Leases', 'LSE');
  await deployer.deploy(CLCToken, 'Colloc', 'CLC');
};
