## Colloc'Chain Smart Contracts

This repository is a classic truffle project and contains smart contracts based on ERC20/ERC721 standards modeling collocation management.

## TODO:

- [✔] - Add ERC20/ERC721 (Openzeppelin for example)
- [ ] - Extend ERC20
  - [✔] - Add functions to mint/burn ERC20 tokens
  - [ ] - Allow given address to manipulate balance of another address
- [ ] - Extend ERC721
  - [✔] - Model leases
  - [✔] - Add functions to mint/burn ERC721 tokens
  - [ ] - Give right permissions
  - [ ] - Connect ERC20 contract
- [ ] - Write Unit Tests
- [✔] - Update migrations + truffle config to deploy on our own network
- [✔] - Update lint-staged + husky
- [ ] - Setup CI/CD

### Dev Tools

- [Prettier](https://prettier.io/): Prettify code
- [Solhint](https://protofire.github.io/solhint/): Check smart contract issues
- [Husky](https://github.com/typicode/husky): Trigger Git Hooks
- [Lint-staged](https://github.com/okonet/lint-staged): Execute actions to staged files

### Configuration

```bash
# Bypass self signed certificate
NODE_TLS_REJECT_UNAUTHORIZED=0

# PROD
RPC_URI_PROD=https://<vm_ip_address>:<port>
SERVER_URI_PROD=https://<vm_ip_address>:<port>

# DEV
RPC_URI_DEV=https://<vm_ip_address>:port
SERVER_URI_DEV=http://localhost:5000
```

### Usage

Deploy to besu - Make sure to have the server running

```bash
$ yarn deploy:besu
```

Unit Tests

```bash
$ yarn test
```

Compile contracts

```bash
$ yarn compile
```

Debug

```bash
$ yarn console
```

Check errors

```bash
$ yarn lint
```

Format solidity and javascript files

```bash
$ yarn prettier
```

## Contribute

If you are not familiar with git:

- Master branch contains the code for production so the code clean, tested and approved
- Release (or Staging) branch contains the code that will be push in production for the next release (maybe overkill for us)
- Dev branch contains new features to add

When you work, create a branch from the dev branch then do your stuff.

```bash
$ git checkout -b yourFeature dev
```

Write **Unit Tests** and if necessary, update config files.

Once you think your feature is done, make a pull request to the `dev branch`.

Also, if you are working on an issue you can reference them like #issue_id

⚠ Please **do not** push directly on Master and Dev ⚠
