require('dotenv').config();
const fetch = require('node-fetch');

const serverUri = process.env.SERVER_URI;

function post(uri, body) {
  fetch(uri, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).catch(console.error);
}

function addOwner(privateKey) {
  const uri = `${serverUri}/api/user/register/owner`;
  const body = {
    firstname: 'owner',
    lastname: 'owner',
    email: 'owner@gmail.com',
    password: '1234',
    privateKey,
  };
  post(uri, body);
}

function updateSmartContractRecords(erc20, erc721) {
  updateOneSmartContractRecord('erc20', erc20);
  updateOneSmartContractRecord('erc721', erc721);
}

function updateOneSmartContractRecord(type, contract) {
  const { address, abi } = contract;
  const uri = `${serverUri}/api/smart-contract/register`;
  const body = {
    erc: type,
    address,
    abi,
  };

  post(uri, body);
}

module.exports = {
  addOwner,
  updateSmartContractRecords,
};
