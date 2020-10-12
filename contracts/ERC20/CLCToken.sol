// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CLCToken is ERC20 {
    // solhint-disable-next-line no-empty-blocks
    constructor(string memory name, string memory symbol) public ERC20(name, symbol) {}

    function deposit(address account, uint256 amount) public returns (bool) {
        require(_msgSender() == account, "ERC20: deposit to someone else address");
        _mint(account, amount);
        return true;
    }

    function withdraw(uint256 amount) public returns (bool) {
        _burn(_msgSender(), amount);
        return true;
    }
}
