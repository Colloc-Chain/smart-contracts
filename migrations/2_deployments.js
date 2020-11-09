const CLCToken = artifacts.require('CLCToken');
const Landlord = artifacts.require('Landlord');

module.exports = async function(deployer,network,accounts)  {
  await deployer.deploy(CLCToken, 'Colloc', 'CLC');
  const clcToken = await CLCToken.deployer();

  await deployer.deploy(Landlord,clcToken.address, 'Leases', 'LSE');
  const landlord = await Landlord.deployer();
  
};
/*const CLCToken = artifacts.require('CLCToken');
const Landlord = artifacts.require('Landlord');

const { updateSmartContractRecords } = require('../scripts/post_deploy');

module.exports = async (deployer, network) => {
  if (network === 'besu') {
    deployer
      .deploy(CLCToken, 'Colloc', 'CLC')
      .then(async erc20 => {
        const erc721 = await deployer.deploy(Landlord, 'Leases', 'LSE');
        return { erc20, erc721 };
      })
      .then(({ erc20, erc721 }) => {
        updateSmartContractRecords(erc20, erc721);
      });
  }

  if (network === 'test') {
    deployer.deploy(CLCToken, 'Colloc', 'CLC').then(async erc20 => {
      const erc721 = await deployer.deploy(Landlord, 'Leases', 'LSE');
      return { erc20, erc721 };
    });
  }
};
*/
