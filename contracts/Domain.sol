// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract Domains {

    mapping(string => address) public domains;

    constructor() {
        console.log("THIS IS MY DOPE GOAT DOMAINS CONTRACT.");
    }

    // A register function that adds their names to our mapping
    function register(string calldata name) public {
        domains[name] = msg.sender;
        console.log("%s has registered a domain!", msg.sender);
    }

    // This will give us the domain owners' address
    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }
}
