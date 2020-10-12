// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LeaseFactory is ERC721, Ownable {
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
        require(tokenId >= 0, "LeaseFactory: token id negative");
        require(tokenId < _tokenIds.current(), "LeaseFactory: token id negative");
        Lease memory lease = leaseById[tokenId];
        return (lease.price, lease.maxTenants, lease.tenants);
    }

    function registerLandlord(address account) public onlyOwner returns (bool) {
        require(isLandlord[account] == false, "LeaseFactory: address already landlord");
        isLandlord[account] = true;
        return true;
    }

    function removeLandlord(address account) public onlyOwner returns (bool) {
        require(isLandlord[account] == true, "LeaseFactory: address not a landlord");
        isLandlord[account] = false;
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

        return tokenId;
    }

    function deleteLease(uint256 tokenId) public returns (uint256) {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "LeaseFactory: caller is not owner nor approved"
        );

        _burn(tokenId);
        return tokenId;
    }
}
