/*module.exports = async function(deployer,network,accounts)  {
  await deployer.deploy(CLCToken, 'Colloc', 'CLC');
  const clcToken = await CLCToken.deployed();

  await deployer.deploy(Landlord,clcToken.address, 'Leases', 'LSE');
  const landlord = await Landlord.deployed();
  
};
*/
const CLCToken = artifacts.require('CLCToken');
const Landlord = artifacts.require('Landlord');

const { updateSmartContractRecords, addOwner } = require('../scripts/post_deploy');

module.exports = async (deployer, network) => {
  if (network === 'development') {
    await deployer.deploy(CLCToken, 'Colloc', 'CLC');
    const clcToken = await CLCToken.deployed();

    await deployer.deploy(Landlord, clcToken.address, 'Leases', 'LSE');
    const landlord = await Landlord.deployed();
  }
  if (network === 'besu') {
    deployer
      .deploy(CLCToken, 'Colloc', 'CLC')
      .then(async erc20 => {
        const erc721 = await deployer.deploy(Landlord, 'Leases', 'LSE');
        return { erc20, erc721 };
      })
      .then(({ erc20, erc721 }) => {
        // ugly but need to make things work quickly
        const ownerPrivateKey = 'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3';
        addOwner(ownerPrivateKey);
        updateSmartContractRecords(erc20, erc721);
      });
  }

  if (network === 'test' || network === 'develop') {
    deployer.deploy(CLCToken, 'Colloc', 'CLC').then(async erc20 => {
      const erc721 = await deployer.deploy(Landlord, 'Leases', 'LSE');
      return { erc20, erc721 };
    });
  }
};
