// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ContestPrize is Ownable, Pausable, ReentrancyGuard {
    constructor() Ownable(msg.sender) {}

    struct comp {
        uint256 Total_amount;
        uint256 Price;
        bool status;
        bool exist;
    }
    // for save each contest wtih ID
    mapping(uint => comp) Components;

    event ContestCreated(uint256 ID, uint256 Price);

    event signupcompleted(uint256 indexed ID, address indexed user);

    event WinnersAwarded(uint256 ID, address first, address second, address third);

    modifier ChecknotexistId(uint id) {
        require(!Components[id].exist, "this ID is already exist");
        _;
    }

    modifier CheckActive(uint id) {
        require(Components[id].status == true, "component finished");
        _;
    }

    modifier CheckexistID(uint id) {
        require(Components[id].exist, "this ID is not exist");
        _;
    }

    // Error for wrong address inputs
    error wrongaddress(address first , address second , address third);


    // This function is used to define a contest and takes the ID and cost of participating in the contest.
    function Addcomp(
        uint256 _ID,
        uint256 _Price , uint256 _totalprize
    ) external onlyOwner ChecknotexistId(_ID) whenNotPaused  {
        if (_Price == 0 ){
            Components[_ID] = comp(_totalprize, 0, true, true);
        }
        else {
            Components[_ID] = comp(0, _Price, true, true);
        }
        emit ContestCreated(_ID, _Price);
    }

    // this function is for user signup in a contest user should call 
    function signup(uint256 _ID) external payable CheckexistID(_ID) CheckActive(_ID) whenNotPaused{
    uint256 price = Components[_ID].Price;
    require(msg.value == price, "Incorrect ETH amount");

    Components[_ID].Total_amount += msg.value;

    emit signupcompleted(_ID, msg.sender);
    }

    function pause() external onlyOwner {
        _pause();
    }
    // if contract is paused, no one can enter the competition
    function unpause() external onlyOwner {
        _unpause();
    }

    // Internal function to safely transfer Ether
    function _safetransfer(address payable recipient, uint256 amount) internal {
        (bool success,) = recipient.call{value: amount}("");
        require(success, "Transfer failed");
    }

    // Divides the prizes of a competition among the winners with predetermined percentages
    function Awardwinners(
        address payable _first,
        address payable _second,
        address payable _Third,
        uint256 _ID
    ) external onlyOwner CheckexistID(_ID) CheckActive(_ID) nonReentrant whenNotPaused {
        if (_first == address(0) || _second == address(0) || _Third == address(0)) {
            revert wrongaddress(_first, _second, _Third);
        }
        uint256 award = Components[_ID].Total_amount; 
        Components[_ID].status = false;
        _safetransfer(_first, (award * 30) / 100);
        Components[_ID].Total_amount -= (30 * award) / 100 ;
        _safetransfer(_second, (award * 20) / 100);
        Components[_ID].Total_amount -= (20 * award) / 100 ;
        _safetransfer(_Third, (award * 10) / 100);
        Components[_ID].Total_amount -= (10 * award) / 100 ;
        emit WinnersAwarded(_ID, _first, _second, _Third);
    }
}