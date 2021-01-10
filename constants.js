require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

// ugly private key - only because nothing at stake and simpler
module.exports = {
  rpc_uri: isProd ? process.env.RPC_URI_PROD : process.env.RPC_URI_DEV,
  server_uri: isProd ? process.env.SERVER_URI_PROD : process.env.SERVER_URI_DEV,
  private_key: 'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
};
