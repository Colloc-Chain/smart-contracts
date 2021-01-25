const truffleAssert = require('truffle-assertions');
const Landlord = artifacts.require('Landlord');
//const LeaseFactory = artifacts.require('LeaseFactory')
const CLCToken = artifacts.require('CLCToken');

const name = 'Leases';
const symbol = 'LSE';
const name2 = 'CLCToken';
const symbol2 = 'CLC';

function formatRawLease(rawLease) {
  return {
    price: rawLease['0'],
    maxTenants: rawLease['1'],
    tenants: rawLease['2'],
  };
}

contract('Landlord', accounts => {
  let erc721, erc721_2, erc20;
  const owner = accounts[0];
  const landlord = accounts[1];
  const tenant = accounts[2];

  beforeEach(async () => {
    erc20 = await CLCToken.new(name2, symbol2, { from: owner });
    erc721 = await Landlord.new(erc20.address, name, symbol, { from: owner });
    //erc721_2 = await LeaseFactory.new()
    await truffleAssert.passes(erc721.registerLandlord(landlord, { from: owner }));

    const isLandlord = await erc721.isLandlord(landlord);

    assert.equal(
      isLandlord,
      true,
      'LeaseFactory: registerLandlord() did not register new landlord '
    );
  });

  describe('Accounts', () => {
    it('should address deploying be owner', async () => {
      const contractOwner = await erc721.owner();
      assert.equal(contractOwner, owner, 'contract owner not set correctly');
    });

    describe('Register landlord', () => {
      // already tested in beforeEach() but showing the result clearly when running tests should be nice
      it('should register landlord', async () => {
        const isLandlord = await erc721.isLandlord(landlord);
        assert.equal(isLandlord, true, 'registerLandlord() did not register new landlord ');
      });

      it('should not register landlord twice', async () => {
        await truffleAssert.reverts(
          erc721.registerLandlord(landlord, { from: owner }),
          'LeaseFactory: address already landlord'
        );
      });

      it('should not register landlord from landlord account', async () => {
        const account = accounts[3];
        await truffleAssert.reverts(
          erc721.registerLandlord(account, { from: landlord }),
          'Ownable: caller is not the owner'
        );
      });

      it('should not register landlord from tenant account', async () => {
        await truffleAssert.reverts(
          erc721.registerLandlord(landlord, { from: tenant }),
          'Ownable: caller is not the owner'
        );
      });
    });

    describe('Remove landlord', () => {
      it('should remove landlord', async () => {
        await truffleAssert.passes(erc721.removeLandlord(landlord, { from: owner }));
        const isLandlord = await erc721.isLandlord(landlord);

        assert.equal(isLandlord, false, 'removeLandlord() did not remove landlord ');
      });

      it('should not remove landlord from landlord account', async () => {
        const otherLandlord = accounts[3];
        await truffleAssert.passes(erc721.registerLandlord(otherLandlord, { from: owner }));

        const isNewLandlord = await erc721.isLandlord(otherLandlord);
        assert.equal(isNewLandlord, true, 'registering new landlord did not pass');

        const isLandlord = await erc721.isLandlord(landlord);
        assert.equal(isLandlord, true, 'removeLandlord() did not remove new landlord ');

        await truffleAssert.reverts(erc721.removeLandlord(landlord, { from: otherLandlord }));
      });

      it('should not remove landlord from tenant', async () => {
        await truffleAssert.reverts(erc721.removeLandlord(landlord, { from: tenant }));
      });

      it('should not remove not landlord address', async () => {
        let isLandlord = await erc721.isLandlord(tenant);
        assert.equal(isLandlord, false, 'tenant is landlord');
        await truffleAssert.reverts(erc721.removeLandlord(tenant, { from: owner }));
      });
    });
  });

  describe('Leases', () => {
    const price = 1200;
    const maxTenants = 3;
    const rent = price / maxTenants;
    const tenants = [];
    const tokenURI = 'tokenURI';
    let tokenId;

    beforeEach(async () => {
      await truffleAssert.passes(
        erc721.createLease(price, maxTenants, tenants, tokenURI, {
          from: landlord,
        })
      );
      const totalTokensCreated = await erc721.getTotalTokensCreated();
      tokenId = totalTokensCreated - 1;
    });

    describe('Create Lease', () => {
      it('should create lease', async () => {
        const totalTokensCreated = await erc721.getTotalTokensCreated();
        assert.equal(totalTokensCreated, 1, 'create lease did not increment _tokenIds');

        // _tokenIds starts at 0
        const tokenId = totalTokensCreated - 1;
        const tokenOwner = await erc721.ownerOf(tokenId);
        assert.equal(tokenOwner, landlord, 'create lease did not mint to right owner');

        const UriOfTokenCreated = await erc721.tokenURI(tokenId);
        assert.equal(UriOfTokenCreated, tokenURI, 'create lease did not set right tokenURI');

        const rawLease = await erc721.getLeaseById(tokenId);
        const lease = formatRawLease(rawLease);

        assert.equal(lease.price, price, 'create lease with wrong price');
        assert.equal(lease.maxTenants, maxTenants, 'create lease with wrong max tenants');
        assert.equal(
          JSON.stringify(lease.tenants),
          JSON.stringify(tenants),
          'create lease with wrong tenants array'
        );
      });

      it('should not create lease from owner', async () => {
        await truffleAssert.reverts(
          erc721.createLease(price, maxTenants, tenants, tokenURI, {
            from: owner,
          })
        );
      });

      it('should not create lease from tenant', async () => {
        await truffleAssert.reverts(
          erc721.createLease(price, maxTenants, tenants, tokenURI, {
            from: tenant,
          })
        );
      });
    });

    describe('Remove Lease', () => {
      it('should remove own lease', async () => {
        const totalTokensCreatedBefore = await erc721.getTotalTokensCreated();
        await truffleAssert.passes(erc721.removeLease(tokenId, { from: landlord }));
        const totalTokensCreatedAfter = await erc721.getTotalTokensCreated();

        // _tokenIds should not be decremented
        assert(
          totalTokensCreatedBefore,
          totalTokensCreatedAfter,
          'remove lease is decrementing tokenIds'
        );

        // check if removed from ERC721 - Not sure if this is the good way to do it
        await truffleAssert.reverts(erc721.tokenByIndex(tokenId));
      });

      it("should not remove someone else's lease", async () => {
        await truffleAssert.reverts(erc721.removeLease(tokenId, { from: tenant }));
      });
    });

    describe('Add Tenant', () => {
      beforeEach(async () => {
        let isTenant = await erc721.isTenant(tenant);
        assert.equal(isTenant, false, 'address already tenant of the same or another property');

        await truffleAssert.passes(erc721.registerTenant(tokenId, tenant, { from: landlord }));

        isTenant = await erc721.isTenant(tenant);
        assert.equal(isTenant, true, 'address did not get correctly registered as tenant');
      });

      it('should not allow address to be tenant of multiple properties', async () => {
        await truffleAssert.reverts(erc721.registerTenant(tokenId, tenant, { from: landlord }));
      });

      it('should add tenant to own lease', async () => {
        // TODO: this assert is dumb because by default uint256 has value 0
        const tenantOf = await erc721.tenantToTokenId(tenant);
        assert.equal(tenantOf, tokenId, 'tenant not registered to right tokenId in mapping');

        const rawLease = await erc721.getLeaseById(tokenId);
        const lease = formatRawLease(rawLease);

        assert.equal(
          JSON.stringify(lease.tenants),
          JSON.stringify([tenant]),
          'tenant address not added to lease tenants array'
        );
      });
      describe('Pay Rent', () => {
        it(`should transfer ${rent} tokens`, async () => {
          await truffleAssert.passes(erc20.deposit(450, { from: tenant }));
          await erc20.approve(erc721.address, rent, { from: tenant });
          await truffleAssert.passes(erc721.PayRent2({ from: tenant }));
          const balance = await erc20.balanceOf(landlord);

          assert.equal(rent, balance, 'ERC721: transfering wrong amount');
        });
      });

      it("should not add tenant to someone else's lease", async () => {
        const otherLandlord = accounts[3];
        const otherTenant = accounts[4];
        await truffleAssert.passes(erc721.registerLandlord(otherLandlord, { from: owner }));

        const isLandlord = await erc721.isLandlord(otherLandlord);
        assert.equal(isLandlord, true, 'new landlord not registered correctly');

        const isAlreadyTenant = await erc721.isTenant(otherTenant);
        assert.equal(isAlreadyTenant, false, 'address should be a tenant');

        await truffleAssert.reverts(
          erc721.registerTenant(tokenId, otherTenant, { from: otherLandlord })
        );
      });

      it('should remove tenant from own lease', async () => {
        await truffleAssert.passes(erc721.removeTenant(tokenId, tenant, { from: landlord }));

        // TODO: this assert is dumb because by default uint256 has value 0
        const tenantOf = await erc721.tenantToTokenId(tenant);
        assert.equal(tenantOf, 0, 'tenant not registered to right tokenId in mapping');

        const rawLease = await erc721.getLeaseById(tokenId);
        const lease = formatRawLease(rawLease);

        assert.equal(
          JSON.stringify(lease.tenants),
          JSON.stringify([]),
          'tenant address not added to lease tenants array'
        );
      });

      it("should not remove tenant from someone else's lease", async () => {
        const otherLandlord = accounts[3];
        await truffleAssert.passes(erc721.registerLandlord(otherLandlord, { from: owner }));

        const isLandlord = await erc721.isLandlord(otherLandlord);
        assert.equal(isLandlord, true, 'new landlord not registered correctly');

        await truffleAssert.reverts(erc721.removeTenant(tokenId, tenant, { from: otherLandlord }));
      });
    });
  });
});
