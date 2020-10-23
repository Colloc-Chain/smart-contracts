const fetch = require('node-fetch');

async function updateSmartContractRecords(erc20, erc721) {
  await updateOneSmartContractRecord('erc20', erc20);
  await updateOneSmartContractRecord('erc721', erc721);
}

function updateOneSmartContractRecord(type, contract) {
  const { address, abi } = contract;
  const uri = 'http://localhost:5000/api/smart-contract/register';

  fetch(uri, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      erc: type,
      address,
      abi,
    }),
  }).catch(console.error);
}

module.exports = {
  updateSmartContractRecords,
};
