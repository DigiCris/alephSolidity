// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Thether is ERC20 {
    constructor() ERC20("Thether", "USDT") {
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
