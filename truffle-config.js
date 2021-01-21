const HDWalletProvider = require('@truffle/hdwallet-provider');
const { rpc_uri, private_key } = require('./constants');

module.exports = {
  networks: {

    besu: {
      provider: () => new HDWalletProvider(private_key, rpc_uri),
      network_id: '*',
    },
  },
  compilers: {
    solc: {
      version: '0.6.2',
    },
  },
};
