// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CLCToken is ERC20 {
    event CreateERC20(address indexed contractAddress, string name, string symbol);

    // solhint-disable-next-line no-empty-blocks
    constructor(string memory name, string memory symbol) public ERC20(name, symbol) {
        emit CreateERC20(address(this), name, symbol);
    }

    function deposit(int256 amount) public returns (bool) {
        require(amount > 0, "ERC20: deposit zero or negative amount");

        _mint(_msgSender(), uint256(amount));

        return true;
    }

    function withdraw(int256 amount) public returns (bool) {
        require(amount > 0, "ERC20: withdraw zero or negative amount");

        _burn(_msgSender(), uint256(amount));

        return true;
    }
}
