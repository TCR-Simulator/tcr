pragma solidity ^0.4.24;

import "tokens/eip20/EIP20.sol";

contract TestToken is EIP20(10000, "TestToken", 18, "TST") {
    constructor() public {}
}