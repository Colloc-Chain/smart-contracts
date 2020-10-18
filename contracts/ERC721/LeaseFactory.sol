// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/utils/Counters.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "../ERC20/CLCToken.sol";

contract LeaseFactory is ERC721, Ownable {
    event LandlordRegistered(address indexed landlord);
    event LandlordRemoved(address indexed landlord);
    event LeaseCreated(address indexed owner, uint256 tokenId, uint256 price, uint256 maxTenants);
    event LeaseRemoved(address indexed owner, uint256 tokenId);

    using Counters for Counters.Counter;
    Counters.Counter internal _tokenIds;

    struct Lease {
        uint256 price;
        uint256 maxTenants;
        address[] tenants;
    }

    mapping(address => bool) public isLandlord;
    mapping(uint256 => Lease) public leaseById;

    // solhint-disable-next-line no-empty-blocks
    constructor(string memory name, string memory symbol) public ERC721(name, symbol) {}

    modifier onlyLandlord() {
        require(isLandlord[_msgSender()] == true, "LeaseFactory: caller is not landlord");
        _;
    }

    // prettier-ignore
    // solhint-disable-next-line max-line-length
    function getLeaseById(uint256 tokenId) public view returns (uint256, uint256, address[] memory) {
        require(tokenId < _tokenIds.current(), "LeaseFactory: token id negative");
        Lease memory lease = leaseById[tokenId];
        return (lease.price, lease.maxTenants, lease.tenants);
    }

    function registerLandlord(address account) public onlyOwner returns (bool) {
        require(isLandlord[account] == false, "LeaseFactory: address already landlord");

        isLandlord[account] = true;

        emit LandlordRegistered(account);

        return true;
    }

    function removeLandlord(address account) public onlyOwner returns (bool) {
        require(isLandlord[account] == true, "LeaseFactory: address not a landlord");

        isLandlord[account] = false;

        emit LandlordRemoved(account);

        return true;
    }

    function createLease(
        uint256 price,
        uint256 maxTenants,
        address[] memory tenants,
        string memory tokenURI
    ) public onlyLandlord returns (uint256) {
        leaseById[_tokenIds.current()] = Lease({
            price: price,
            maxTenants: maxTenants,
            tenants: tenants
        });

        uint256 tokenId = _tokenIds.current();

        _tokenIds.increment();

        _safeMint(_msgSender(), tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit LeaseCreated(_msgSender(), tokenId, price, maxTenants);

        return tokenId;
    }

    function removeLease(uint256 tokenId) public returns (uint256) {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "LeaseFactory: caller is not owner nor approved"
        );

        _burn(tokenId);
        delete leaseById[tokenId];

        emit LeaseRemoved(_msgSender(), tokenId);

        return tokenId;
    }
}
