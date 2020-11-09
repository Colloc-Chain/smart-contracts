// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "./LeaseFactory.sol";
import "../ERC20/CLCToken.sol";

contract Landlord is LeaseFactory {
    event TenantRegistered(uint256 tokenId, address indexed tenant);
    event TenantRemoved(uint256 tokenId, address indexed tenant);

    mapping(address => bool) public isTenant;
    mapping(address => uint256) public tenantToTokenId;
    CLCToken public _erc20 ;

    // solhint-disable-next-line no-empty-blocks
    constructor(CLCToken erc20, string memory name, string memory symbol) public LeaseFactory(name, symbol) {
        _erc20 = erc20;
    }
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

    function _checkAddressAndTokenId(address account, uint256 tokenId) private view {
        require(account != address(0), "Landlord: address is address(0)");
        require(tokenId < _tokenIds.current(), "Landlord: tokenId too large");
    }
    function PayRent(address account_from, address account_to, uint256 amount) public 
    {
        require(isTenant[account_from],"Landlord: sending address is not tenant");
        require(isLandlord[_msgSender()],"Landlord : receiving address is not landlord");
        uint256 rent= leaseById[tenantToTokenId[account_from]].price / leaseById[tenantToTokenId[account_from]].maxTenants;
        _erc20.transferFrom(account_from,account_to,rent);
        
    }
}
