// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Contestprize.sol";

contract Deploycontestprize is Script {
    Contestprize mycontract;
    function setUp() public {}
    function run() public {
        uint256 key = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(key);
        mycontract = new Contestprize();
        vm.stopBroadcast();
    }
}