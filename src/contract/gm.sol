// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GM {
    event GMSaid(string message, address sender, uint256 timestamp);
    
    uint256 public totalGMs;
    mapping(address => uint256) public userGMs;
    
    function sayGM() public {
        totalGMs++;
        userGMs[msg.sender]++;
        
        emit GMSaid("gm", msg.sender, block.timestamp);
    }
    
    function getTotalGMs() public view returns (uint256) {
        return totalGMs;
    }
    
    function getUserGMs(address user) public view returns (uint256) {
        return userGMs[user];
    }
}
