require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const privateKey = 'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3';
const rpc_uri = process.env.RPC_URI;

module.exports = {
  networks: {
    besu: {
      provider: () => new HDWalletProvider(privateKey, rpc_uri),
      network_id: '*',
    },
  },
  compilers: {
    solc: {
      version: '0.6.2',
    },
  },
};
