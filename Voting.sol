// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    struct Proposal {
        string name;
        string[] options;
        uint[] votes;
        bool finalized;
        uint deadline;
    }

    Proposal[] public proposals;
    mapping(uint => mapping(address => bool)) public hasVoted;

    function createProposal(
        string memory _name,
        string[] memory _options,
        uint _duration
    ) external {
        require(_options.length >= 2, "At least 2 options required");

        Proposal storage p = proposals.push();
        p.name = _name;
        p.options = _options;
        p.votes = new uint[](_options.length);
        p.finalized = false;
        p.deadline = block.timestamp + _duration;
    }

    function vote(uint _id, uint _optionIndex) external {
        Proposal storage p = proposals[_id];

        require(!hasVoted[_id][msg.sender], "Already voted");
        require(_optionIndex < p.options.length, "Invalid option");
        require(block.timestamp < p.deadline, "Voting ended");

        p.votes[_optionIndex] += 1;
        hasVoted[_id][msg.sender] = true;
    }

    function finalize(uint _id) external {
        Proposal storage p = proposals[_id];
        require(block.timestamp >= p.deadline, "Voting still active");
        p.finalized = true;
    }

    function getProposalCount() external view returns (uint) {
        return proposals.length;
    }

    function getProposal(uint _id)
        external
        view
        returns (
            string memory,
            string[] memory,
            uint[] memory,
            bool,
            uint
        )
    {
        Proposal storage p = proposals[_id];
        return (p.name, p.options, p.votes, p.finalized, p.deadline);
    }
}
