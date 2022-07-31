// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract GreetPortal {
    uint256 totalGreets;

    event NewGreet(address indexed from, uint256 timestamp, string meesage);

    struct Greet {
        address greeter;
        string message;
        uint timestamp;
    }

    Greet[] greets;

    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function greet(string memory _message) public {
        totalGreets += 1;
        console.log("%s has greeted!", msg.sender, _message);

        greets.push(Greet(msg.sender, _message, block.timestamp));

        emit NewGreet(msg.sender, block.timestamp, _message);
    }

    function getAllGreets() public view returns (Greet[] memory) {
        return greets;
    }

    function getTotalGreets() public view returns (uint256) {
        console.log("We have %d total greets!", totalGreets);
        return totalGreets;
    }
}
