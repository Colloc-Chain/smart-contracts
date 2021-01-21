const HDWalletProvider = require('@truffle/hdwallet-provider');
const { rpc_uri, private_key } = require('./constants');

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: '*', // Any network (default: none)
    },
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
