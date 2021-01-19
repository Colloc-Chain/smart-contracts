const truffleAssert = require('truffle-assertions');
const CLCToken = artifacts.require('CLCToken');

const name = 'CLCToken';
const symbol = 'CLC';

contract('CLCToken', accounts => {
  let erc20;
  const amount = 100;
  const account = accounts[0];
  const spender = accounts[1];

  beforeEach(async () => {
    erc20 = await CLCToken.new(name, symbol, { from: account });
    assert.ok(amount > 0, 'amount is zero or negative');
  });

  describe('Deposit', () => {
    it(`should deposit ${amount} tokens to own account`, async () => {
      await truffleAssert.passes(erc20.deposit(amount, { from: account }));
      const balance = await erc20.balanceOf(account);

      assert.equal(balance, amount, 'ERC20: deposit wrong amount');
    });

    it('should not deposit zero or negative amount', async () => {
      let zero_amount = 0;
      let negative_amount = -100;

      await truffleAssert.reverts(
        erc20.deposit(zero_amount, { from: account }),
        'ERC20: deposit zero or negative amount'
      );
      await truffleAssert.reverts(
        erc20.deposit(negative_amount, { from: account }),
        'ERC20: deposit zero or negative amount'
      );
    });
  });

  describe('Withdraw', () => {
    it(`should withdraw ${amount} tokens`, async () => {
      await truffleAssert.passes(erc20.deposit(amount, { from: account }));
      const balanceAfterDeposit = await erc20.balanceOf(account);

      await truffleAssert.passes(erc20.withdraw(amount, { from: account }));
      const balanceAfterWithdraw = await erc20.balanceOf(account);

      assert.equal(
        balanceAfterWithdraw,
        balanceAfterDeposit - amount,
        'ERC20: Withdraw wrong amount'
      );
    });

    it('should not withdraw zero or negative values', async () => {
      let zero_amount = 0;
      let negative_amount = -100;

      await truffleAssert.reverts(
        erc20.withdraw(zero_amount, { from: account }),
        'ERC20: withdraw zero or negative amount'
      );
      await truffleAssert.reverts(
        erc20.withdraw(negative_amount, { from: account }),
        'ERC20: withdraw zero or negative amount'
      );
    });
  });
});
