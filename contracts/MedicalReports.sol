// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MedicalReports {
    struct Report {
        string wallet;
        string text;
        string summary;
        bool emergency;
        string emergencyMsg;
        uint256 createdAt;
    }
    
    mapping(uint256 => Report) public reports;
    mapping(string => uint256[]) public userReports; // wallet -> report IDs
    uint256 public reportCounter;
    
    event ReportCreated(
        uint256 indexed reportId,
        string indexed wallet,
        bool emergency,
        uint256 createdAt
    );
    
    function createReport(
        string memory _wallet,
        string memory _text,
        string memory _summary,
        bool _emergency,
        string memory _emergencyMsg
    ) public returns (uint256) {
        reportCounter++;
        
        reports[reportCounter] = Report({
            wallet: _wallet,
            text: _text,
            summary: _summary,
            emergency: _emergency,
            emergencyMsg: _emergencyMsg,
            createdAt: block.timestamp
        });
        
        userReports[_wallet].push(reportCounter);
        
        emit ReportCreated(reportCounter, _wallet, _emergency, block.timestamp);
        
        return reportCounter;
    }
    
    function getReport(uint256 _reportId) public view returns (Report memory) {
        require(_reportId > 0 && _reportId <= reportCounter, "Report does not exist");
        return reports[_reportId];
    }
    
    function getUserReports(string memory _wallet) public view returns (uint256[] memory) {
        return userReports[_wallet];
    }
    
    function getTotalReports() public view returns (uint256) {
        return reportCounter;
    }
}