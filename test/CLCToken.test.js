const truffleAssert = require('truffle-assertions');
const CLCToken = artifacts.require('CLCToken');

const name = 'CLCToken';
const symbol = 'CLC';

contract('CLCToken', accounts => {
  let erc20;
  const amount = 100;
  const account = accounts[0];

  beforeEach(async () => {
    erc20 = await CLCToken.new(name, symbol, { from: account });
  });

  it(`should deposit ${amount} tokens`, async () => {
    await truffleAssert.passes(erc20.deposit(account, amount, { from: account }));
    const balance = await erc20.balanceOf(account);

    assert.equal(amount, balance, 'ERC20: deposit wrong amount');
  });

  it(`should withdraw ${amount} tokens`, async () => {
    await truffleAssert.passes(erc20.deposit(account, amount, { from: account }));
    const balanceAfterDeposit = await erc20.balanceOf(account);

    await truffleAssert.passes(erc20.withdraw(amount, { from: account }));
    const balanceAfterWithdraw = await erc20.balanceOf(account);

    assert.equal(
      balanceAfterWithdraw,
      balanceAfterDeposit - amount,
      'ERC20: Withdraw wrong amount'
    );
  });

  it('should not deposit to another account', async () => {
    const account2 = accounts[1];
    await truffleAssert.reverts(
      erc20.deposit(account, amount, { from: account2 }),
      'ERC20: deposit to someone else address'
    );
  });
});
