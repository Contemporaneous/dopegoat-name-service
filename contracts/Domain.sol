// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "hardhat/console.sol";
import { StringUtils } from "./libraries/StringUtils.sol";

contract Domains {
    string public tld;

    mapping(string => address) public domains;
    mapping(string => string) public records;

    constructor(string memory _tld) {
        tld = _tld;
        console.log("%s name service deployed", _tld);
    }

    // This function will give us the price of a domain based on length
    function price(string calldata name) public pure returns(uint) {
        uint len = StringUtils.strlen(name);
        require(len > 0);

        if (len == 3) {
            return 5 * 10**17; // 5 MATIC = 5 000 000 000 000 000 000 (18 decimals). We're going with 0.5 Matic cause the faucets don't give a lot
        } else if (len == 4) {
            return 3 * 10**17; // To charge smaller amounts, reduce the decimals. This is 0.3
        } else {
            return 1 * 10**17;
        }
    }

    // A register function that adds their names to our mapping
    function register(string calldata name) public payable{
        // Check if the name is already registered
        require(domains[name] == address(0)); 

        uint _price = price(name);

        //Check if the caller has enough funds
        require(msg.value >= _price, "Not enough Matic paid");

        domains[name] = msg.sender;
        console.log("%s has registered a domain!", msg.sender);
    }

    // This will give us the domain owners' address
    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }

    function setRecord(string calldata name, string calldata record) public {
        // Check that the owner is the transaction sender
        require(domains[name] == msg.sender);

        records[name] = record;
    }

    function getRecord(string calldata name) public view returns(string memory) {
        return records[name];
    }
}
