// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "./LeaseFactory.sol";

contract Landlord is LeaseFactory {
    // solhint-disable-next-line no-empty-blocks
    constructor(string memory name, string memory symbol) public LeaseFactory(name, symbol) {}

    modifier onlyLandlordOf(uint256 tokenId) {
        address owner = ownerOf(tokenId);
        require(_msgSender() == owner, "Landlord: caller is not owner of tokenId");
        _;
    }

    function registerTenant(uint256 tokenId, address account)
        public
        onlyLandlordOf(tokenId)
        returns (bool)
    {
        require(!_isTenantOf(tokenId, account), "Landlord: address is already a tenant");

        Lease storage lease = leaseById[tokenId];
        uint256 maxTenants = lease.maxTenants;
        address[] memory tenants = lease.tenants;

        require(tenants.length < maxTenants, "Landlord: max tenants already reached");

        lease.tenants.push(account);

        return true;
    }

    function removeTenant(uint256 tokenId, address account)
        public
        onlyLandlordOf(tokenId)
        returns (bool)
    {
        require(_isTenantOf(tokenId, account), "Landlord: address is not a tenant");

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

        return true;
    }

    function _isTenantOf(uint256 tokenId, address account) private view returns (bool) {
        require(account != address(0), "Landlord: account is address(0)");
        require(tokenId >= 0, "Landlord: token id is lower than 0");
        require(tokenId < _tokenIds.current(), "Landlord: token id greater than total tokens");

        Lease memory lease = leaseById[tokenId];
        address[] memory tenants = lease.tenants;

        for (uint256 i = 0; i < tenants.length; i++) {
            if (tenants[i] == account) {
                return true;
            }
        }

        return false;
    }
}
