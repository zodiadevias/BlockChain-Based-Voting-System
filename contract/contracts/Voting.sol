// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <=0.8.20;
pragma experimental ABIEncoderV2;

contract DecentralizedVoting {
    address[] public org;
    address deployer;

    struct User {
        string userName;
        string email;
    }

    mapping(address => User) public users;

    struct Candidate {
        string name;
        string position;
        uint256 voteCount;
    }

    struct Election {
        string name;
        bool active;
        Candidate[] candidates;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Election) public elections;
    uint256 public electionCount;

    event ElectionCreated(uint256 electionId, string name);
    event CandidateAdded(uint256 electionId, string name);
    event Voted(uint256 electionId, uint256 candidateIndex, address voter);

    modifier onlyOrg() {
        bool isOrg = false;
        for (uint256 i = 0; i < org.length; i++) {
            if (msg.sender == org[i]) {
                isOrg = true;
                break;
            }
        }
        require(isOrg, "Only the organizer can perform this action");
        _;
    }

    constructor() public {
        addOrg();
        deployer = msg.sender;
    }


    
    function addOrg() public {
        org.push(msg.sender);
    }    

    
    function getOrg(address _org) public view returns (bool) {
        for (uint i = 0; i < org.length; i++) {
            if (org[i] == _org) {
                return true;
                
            }
        }
        return false;
    }
    
    function addUser(address userAddress, string memory userName, string memory email) public {
        require(bytes(users[userAddress].userName).length == 0, "User already exists");
        users[userAddress] = User(userName, email);
    }

    function isUser(address userAddress) public view returns (bool){
        return bytes(users[userAddress].userName).length > 0;
    }

    function getUserAddress() public view returns (address) {
        return msg.sender;
    }

    function getUserName(address userAddress) public view returns (string memory){
        User storage user = users[userAddress];
        if(bytes(user.userName).length > 0)
            return string(abi.encodePacked(user.userName));
    }

    function getEmail(address userAddress) public view returns (string memory){
        User storage user = users[userAddress];
        if(bytes(user.email).length > 0)
            return string(abi.encodePacked(user.email));
    }



    function getOwnerAddress() public view returns (address) {
        return deployer;
    }

    // Create a new election (only owner)
    function createElection(string memory _name) public onlyOrg {
        electionCount++;
        Election storage newElection = elections[electionCount];
        newElection.name = _name;
        newElection.active = true;

        emit ElectionCreated(electionCount, _name);
    }

    // Add a candidate to an election (only owner)
    function addCandidate(uint256 _electionId, string memory _candidateName, string memory _candidatePosition) public onlyOrg {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        require(elections[_electionId].active, "Election is not active");

        elections[_electionId].candidates.push(Candidate({ name: _candidateName, voteCount: 0 , position: _candidatePosition}));
        emit CandidateAdded(_electionId, _candidateName);
    }

    // Vote for a candidate in an election
    function vote(uint256 _electionId, uint256 _candidateIndex) public {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        Election storage election = elections[_electionId];

        require(election.active, "Election is not active");
        require(!election.hasVoted[msg.sender], "You have already voted");

        election.candidates[_candidateIndex].voteCount++;
        election.hasVoted[msg.sender] = true;

        emit Voted(_electionId, _candidateIndex, msg.sender);
    }

    // Get election results
    function getElectionResults(uint256 _electionId) public view returns (string memory, uint256[] memory) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        Election storage election = elections[_electionId];

        uint256[] memory votes = new uint256[](election.candidates.length);
        for (uint256 i = 0; i < election.candidates.length; i++) {
            votes[i] = election.candidates[i].voteCount;
        }

        return (election.name, votes);
    }

    // Get the number of candidates in an election
    function getCandidatesCount(uint256 _electionId) public view returns (uint256) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        return elections[_electionId].candidates.length;
    }


    
    // Get candidate name
    function getCandidateName(uint256 _electionId, uint256 _candidateIndex) public view returns (string memory) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        require(_candidateIndex < elections[_electionId].candidates.length, "Candidate does not exist");
        return elections[_electionId].candidates[_candidateIndex].name;
    }

    function getCandidateNames(uint256 _electionId) public view returns (string[] memory) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");

        uint256 candidateCount = elections[_electionId].candidates.length;
        string[] memory candidateNames = new string[](candidateCount);

        for (uint256 i = 0; i < candidateCount; i++) {
            candidateNames[i] = elections[_electionId].candidates[i].name;
        }

        return candidateNames;
    }
    
    // Get election name
    function getElectionName(uint256 _electionId) public view returns (string memory) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        return elections[_electionId].name;
    }

    // Close an election (only owner)
    function closeElection(uint256 _electionId) public onlyOrg {
        require(_electionId > 0 && _electionId <= electionCount && elections[_electionId].active == true, "Election does not exist or is not active");
        elections[_electionId].active = false;
    }

    
    // Get list of all election names
    function getElectionNames() public view returns (string[] memory) {
        string[] memory electionNames = new string[](electionCount);

        for (uint256 i = 0; i < electionCount; i++) {
            electionNames[i] = elections[i + 1].name;
        }

        return electionNames;
    }



}
