// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract ContestPrize is Ownable, Pausable {
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

    modifier ChecknotexistId(uint id) {
        require(!Components[id].exist, "this ID is already exist");
        _;
    }


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
    function signup(uint256 _ID) external payable {
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
}