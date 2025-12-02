// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Contestprize.sol";

contract ContestprizeTest is Test {
   Contestprize _contestPrize;
    function setUp() public {
      _contestPrize = new Contestprize();
    }
   
    function testaddcomp() public {
          _contestPrize.Addcomp(1, 10, 0);
          vm.expectRevert(bytes("this ID is already exist"));
          _contestPrize.Addcomp(1, 10, 0);
          vm.prank(0x0000000000000000000000000000000000001234);
          vm.expectRevert();
          _contestPrize.Addcomp(2, 2, 2);
   }

    function testsignup() public{
          address _testaddress = 0x0000000000000000000000000000000000001234 ;
          _contestPrize.Addcomp(1, 10 ether , 0);
          vm.expectRevert(bytes("this ID is not exist"));
          _contestPrize.signup(2);
          vm.deal(_testaddress, 100 ether);
          vm.startPrank(_testaddress);
          _contestPrize.signup{value : 10 ether}(1);
          vm.stopPrank();
          assertEq(address(_contestPrize).balance , 10 ether);
   }

   
    function testaddbudgetfreecomp() public {
          vm.deal(address(this), 100 ether);
          _contestPrize.Addcomp(1, 0 , 10 ether);
          vm.expectRevert(bytes("Must send ETH"));
          _contestPrize.addbudgeforfreecomp{value : 5 ether}(1);
   }

    function testawardwinners() public {
          address _testaddress1 = 0x0000000000000000000000000000000000001234 ;
          address _testaddress2 = 0x0000000000000000000000000000000000004231 ;
          address _testaddress3 = 0x0000000000000000000000000000000000005343 ;
          vm.deal(_testaddress1, 0);
          vm.deal(_testaddress2, 0);
          vm.deal(_testaddress3, 0);
          _contestPrize.Addcomp(1, 0 , 100 ether);
          vm.deal(address(this), 100 ether);
          _contestPrize.addbudgeforfreecomp{value : 100 ether}(1);
          _contestPrize.Awardwinners(payable(_testaddress1),payable(_testaddress2) , payable(_testaddress3), 1);
          assertEq(_testaddress1.balance , 30 ether);
          assertEq(_testaddress2.balance , 20 ether);
          assertEq(_testaddress3.balance , 10 ether);
         
   }
}