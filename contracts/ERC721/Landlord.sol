// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "./LeaseFactory.sol";
import "../ERC20/CLCToken.sol";

contract Landlord is LeaseFactory {
    event TenantRegistered(uint256 tokenId, address indexed tenant);
    event TenantRemoved(uint256 tokenId, address indexed tenant);
    event RentPaid(address indexed tenant, uint256 rent);

    mapping(address => bool) public isTenant;
    // Mapping from address a boolean. True if the address is a tenant and false if not a Tenant.
    mapping(address => uint256) public tenantToTokenId;
    // Mapping from address to the token id
    CLCToken public _erc20;
    
    constructor(
        CLCToken erc20,
        string memory name,
        string memory symbol
    ) public LeaseFactory(name, symbol) {
        _erc20 = erc20;
    }
    /**
     *  Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    modifier OnlyTenant() {
        require(isTenant[_msgSender()] == true, "Landlord: caller is not tenant");
        _;
    }
    // Modifier requiring the msgSender to be a tenant 
    modifier onlyLandlordOf(uint256 tokenId) {
        address owner = ownerOf(tokenId);
        require(_msgSender() == owner, "Landlord: caller is not owner of tokenId");
        _;
    }
    // Modifier requiring the msgSender to be the landlord and thus owner of the tokenID 
    function registerTenant(uint256 tokenId, address account)
        public
        onlyLandlordOf(tokenId)
        returns (bool)
    {
        _checkAddressAndTokenId(account, tokenId);

        require(!isTenant[account], "Landlord: address already tenant");

        Lease storage lease = leaseById[tokenId];
        uint256 maxTenants = lease.maxTenants;
        address[] memory tenants = lease.tenants;

        require(tenants.length < maxTenants, "Landlord: max tenants already reached");

        lease.tenants.push(account);

        isTenant[account] = true;
        tenantToTokenId[account] = tokenId;

        emit TenantRegistered(tokenId, account);

        return true;
    }
    /**
     * Adds a tenant to the lease and updates the mappings
     *
     * Requirements:
     *
     * - Only the landlord can use this function.
     * - The tenant added cannot already be a tenant
     * Emits a TenantRegistered event.
     * Returns a boolean.
     */
    function removeTenant(uint256 tokenId, address account)
        public
        onlyLandlordOf(tokenId)
        returns (bool)
    {
        _checkAddressAndTokenId(account, tokenId);

        require(isTenant[account], "Landlord: address not tenant");

        Lease storage lease = leaseById[tokenId];
        address[] storage tenants = lease.tenants;

        uint256 size = tenants.length;

        for (uint256 i = 0; i < size; i++) {
            if (tenants[i] == account) {
                // remove gap
                if (i < size - 1) {
                    tenants[i] = tenants[size - 1];
                }

                tenants.pop();
                break;
            }
        }

        isTenant[account] = false;
        delete tenantToTokenId[account];

        emit TenantRemoved(tokenId, account);

        return true;
    }
    /**
     * Removes a tenant from the lease and updates the mappings 
     *
     * Requirements:
     *
     * - Only the landlord can use this function.
     * - The tenant added needs to  be a tenant
     * Emits a TenantRemoved event.
     * Returns a boolean.
     */
    function _checkAddressAndTokenId(address account, uint256 tokenId) private view {
        require(account != address(0), "Landlord: address is address(0)");
        require(tokenId < _tokenIds.current(), "Landlord: tokenId too large");
    }
    /**
     * Checks if the address and tokenID are valid 
     *
     * Requirements:
     *
     * - Address needs to not be address(0)
     * - Tokenid needs to be valid
     *
     */
    function PayRent(address account_from, address account_to) public returns (bool) {
        require(isTenant[_msgSender()], "Landlord: sending address is not tenant");
        require(isLandlord[account_to], "Landlord : receiving address is not landlord");
        uint256 rent = leaseById[tenantToTokenId[account_from]].price /
            leaseById[tenantToTokenId[account_from]].maxTenants;

        _erc20.approve(account_to, rent);
        _erc20.transferFrom(account_from, account_to, rent);
        emit RentPaid(account_from, rent);
        return true;
    }
    /**
     * Allows the tenant to pay the rent 
     *
     * Requirements:
     *
     * - Only a tenant can use this function.
     * - Rent can only be sent to the landlord
     * 
     * Emits a RentPaid event.
     * Returns a boolean.
     */
}
