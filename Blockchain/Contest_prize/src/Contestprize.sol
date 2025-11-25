// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";


contract ContestPrize is Ownable {
    constructor() Ownable(msg.sender) {}

    struct comp {
        uint256 Total_amount;
        uint256 Price;
        bool status;
        bool exist;
    }
     // for save each contest wtih ID
    mapping(uint => comp) Components;
}