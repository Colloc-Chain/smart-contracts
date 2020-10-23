const CLCToken = artifacts.require('CLCToken');
const Landlord = artifacts.require('Landlord');

const { updateSmartContractRecords } = require('../scripts/post_deploy');

module.exports = async deployer => {
  deployer
    .deploy(CLCToken, 'Colloc', 'CLC')
    .then(async erc20 => {
      const erc721 = await deployer.deploy(Landlord, 'Leases', 'LSE');
      return { erc20, erc721 };
    })
    .then(({ erc20, erc721 }) => {
      updateSmartContractRecords(erc20, erc721);
    });
};
