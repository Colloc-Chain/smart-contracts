// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Leases is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Lease {
        uint256 price;
        uint256 maxTenants;
        address[] tenants;
    }

    mapping(address => bool) public isLandlord;

    // solhint-disable-next-line no-empty-blocks
    constructor(string memory name, string memory symbol) public ERC721(name, symbol) {}

    modifier onlyLandlord() {
        require(isLandlord[_msgSender()] == true, "Lease: address calling is not landlord");
        _;
    }

    function registerLandlord(address account) public onlyOwner returns (bool) {
        require(isLandlord[account] == false, "Lease: address already landlord");
        isLandlord[account] = true;
        return true;
    }

    function createLease(string memory tokenURI) public onlyLandlord returns (uint256) {
        _tokenIds.increment();

        uint256 tokenId = _tokenIds.current();
        _safeMint(_msgSender(), tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }
}
