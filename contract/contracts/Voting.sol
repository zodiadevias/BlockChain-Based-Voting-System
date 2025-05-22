// SPDX-License-Identifier: MIT
pragma solidity  >=0.4.21 <=0.8.20;
pragma experimental ABIEncoderV2;


contract DecentralizedVoting {
    //address[] public org;

    mapping(address => UserOrg) public org;

    struct UserOrg {
        string orgName;
        string userName;
        string email;
    }

    mapping (address => CreatedElections[]) public ownedElections;

    struct CreatedElections {
        uint256 electionId;
        string electionName;
    }


    //mapping(address => uint[]) createdElectionID;

    address deployer;

    struct User {
        string userName;
        string email;
        uint[] recentlyVotedIDs;
    }

    mapping(address => User) public users;

    struct Candidate {
        string name;
        string position;
        string platform;
        string cdn;
        uint256 voteCount;
    }

    

    struct Election {
        string name;
        bool active;
        Candidate[] candidates;
        string startDate;
        string endDate;
        string domainFilter;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Election) public elections;
    uint256 public electionCount;

    event ElectionCreated(uint256 electionId, string name);
    event CandidateAdded(uint256 electionId, string name);
    event Voted(uint256 electionId, uint256[] candidateIndex, address voter);

    modifier onlyOrg() {
        
        require(bytes(org[msg.sender].orgName).length > 0 || msg.sender == deployer, "Only the organizer can perform this action");
        _;
    }

    constructor() public {
        deployer = msg.sender;
    }

     // Create a new election (only owner)
    function createElection(string memory _name, string memory _startDate, string memory _endDate, string memory _domainFilter) public onlyOrg {
        electionCount++;
        Election storage newElection = elections[electionCount];
        newElection.name = _name;
        newElection.active = true;
        newElection.startDate = _startDate;
        newElection.endDate = _endDate;
        newElection.domainFilter = _domainFilter;
        addToOwnedElections(msg.sender, electionCount, _name);
        emit ElectionCreated(electionCount, _name);
    }




    
    // Update election details
    function updateElectionDetails(uint256 _electionId, string memory _newName, string memory _startDate, string memory _endDate, string memory _newDomainFilter) public onlyOrg {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        Election storage election = elections[_electionId];
        
        election.name = _newName;
        election.startDate = _startDate;
        election.endDate = _endDate;
        election.domainFilter = _newDomainFilter;

        // Update the name in the owned elections
        CreatedElections[] storage electionsList = ownedElections[msg.sender];
        for (uint256 i = 0; i < electionsList.length; i++) {
            if (electionsList[i].electionId == _electionId) {
                electionsList[i].electionName = _newName;
                break;
            }
        }

        // Emit an event for the update
        emit ElectionCreated(_electionId, _newName);
    }




    function addToOwnedElections(address organizer, uint256 _electionId, string memory _electionName) internal {
        ownedElections[organizer].push(CreatedElections({
        electionId: _electionId,
        electionName: _electionName
    }));
    }

    function getOwnedElections(address organizer) public view returns (CreatedElections[] memory) {
        return ownedElections[organizer];
    }



    function getOwnedElectionIds(address organizer) public view returns (uint256[] memory) {
    uint256 count = ownedElections[organizer].length;
    uint256[] memory ids = new uint256[](count);

    for (uint256 i = 0; i < count; i++) {
        ids[i] = ownedElections[organizer][i].electionId;
    }

    return ids;
    }

    function getOwnedElectionNames(address organizer) public view returns (string[] memory) {
        uint256 count = ownedElections[organizer].length;
        string[] memory names = new string[](count);

        for (uint256 i = 0; i < count; i++) {
            names[i] = ownedElections[organizer][i].electionName;
        }

        return names;
    }

    function getElectionIdByName(address organizer, string memory _name) public view returns (uint256) {
    CreatedElections[] storage electionsList = ownedElections[organizer];
    for (uint256 i = 0; i < electionsList.length; i++) {
        if (keccak256(bytes(electionsList[i].electionName)) == keccak256(bytes(_name))) {
            return electionsList[i].electionId;
        }
    }
    revert("Election not found");
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

    
    // Get election start date
    function getElectionStartDate(uint256 _electionId) public view returns (string memory) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        return elections[_electionId].startDate;
    }

    
    // Get election end date
    function getElectionEndDate(uint256 _electionId) public view returns (string memory) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        return elections[_electionId].endDate;
    }


    
    // Get election domain filter
    function getElectionDomainFilter(uint256 _electionId) public view returns (string memory) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        return elections[_electionId].domainFilter;
    }

    

    // Get election status
    function getElectionStatus(uint256 _electionId) public view returns (bool) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        return elections[_electionId].active;
    }

    //end Election


    // Add a candidate to an election (only owner)
    function addCandidate(uint256 _electionId, string memory _candidateName, string memory _candidatePosition, string memory _platform, string memory _cdn) public onlyOrg {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        require(elections[_electionId].active, "Election is not active");

        elections[_electionId].candidates.push(Candidate({ name: _candidateName, voteCount: 0 , position: _candidatePosition , platform: _platform, cdn: _cdn}));
        emit CandidateAdded(_electionId, _candidateName);
    }

    
    // Add multiple candidates to an election (only owner)
    function addMultipleCandidates(uint256 _electionId, string[] memory _candidateNames, string[] memory _candidatePositions, string[] memory _platforms, string[] memory _cdns) public onlyOrg {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        require(elections[_electionId].active, "Election is not active");

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            elections[_electionId].candidates.push(Candidate({ name: _candidateNames[i], voteCount: 0 , position: _candidatePositions[i] , platform: _platforms[i], cdn: _cdns[i]}));
            emit CandidateAdded(_electionId, _candidateNames[i]);
        }
    }

    
    // Update candidate information
    function updateCandidateInfo(uint256 _electionId, uint256 _candidateIndex, string memory _newName, string memory _newPosition, string memory _newPlatform, string memory _newcdn) public onlyOrg {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        require(_candidateIndex < elections[_electionId].candidates.length, "Candidate does not exist");
        
        Candidate storage candidate = elections[_electionId].candidates[_candidateIndex];
        
        if (keccak256(bytes(candidate.name)) != keccak256(bytes(_newName))) {
            candidate.name = _newName;
        }
        
        if (keccak256(bytes(candidate.position)) != keccak256(bytes(_newPosition))) {
            candidate.position = _newPosition;
        }
        
        if (keccak256(bytes(candidate.platform)) != keccak256(bytes(_newPlatform))) {
            candidate.platform = _newPlatform;
        }

        if (keccak256(bytes(candidate.cdn)) != keccak256(bytes(_newcdn))) {
            candidate.cdn = _newcdn;
        }
        
        // TODO: update the event
    }

    // Delete a candidate from an election (only owner)
    function deleteCandidate(uint256 _electionId, uint256 _candidateIndex) public onlyOrg {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        require(_candidateIndex < elections[_electionId].candidates.length, "Candidate does not exist");

        // Remove the candidate by shifting elements to the left
        for (uint256 i = _candidateIndex; i < elections[_electionId].candidates.length - 1; i++) {
            elections[_electionId].candidates[i] = elections[_electionId].candidates[i + 1];
        }
        
        // Remove the last element
        elections[_electionId].candidates.pop();
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

    
    // Get candidate position
    function getCandidatePosition(uint256 _electionId, uint256 _candidateIndex) public view returns (string memory) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        require(_candidateIndex < elections[_electionId].candidates.length, "Candidate does not exist");
        return elections[_electionId].candidates[_candidateIndex].position;
    }


    //get candidate platform
    function getCandidatePlatform(uint256 _electionId, uint256 _candidateIndex) public view returns (string memory) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        require(_candidateIndex < elections[_electionId].candidates.length, "Candidate does not exist");
        return elections[_electionId].candidates[_candidateIndex].platform;
    }

    function getCandidateCdn(uint256 _electionId, uint256 _candidateIndex) public view returns (string memory) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        require(_candidateIndex < elections[_electionId].candidates.length, "Candidate does not exist");
        return elections[_electionId].candidates[_candidateIndex].cdn;
    }


    //get candidate names
    function getCandidateNames(uint256 _electionId) public view returns (string[] memory) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");

        uint256 candidateCount = elections[_electionId].candidates.length;
        string[] memory candidateNames = new string[](candidateCount);

        for (uint256 i = 0; i < candidateCount; i++) {
            candidateNames[i] = elections[_electionId].candidates[i].name;
        }

        return candidateNames;
    }

    
    //get candidate ID by name
    function getCandidateIDbyName(uint256 _electionId, string memory _candidateName) public view returns (uint256) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");

        uint256 candidateCount = elections[_electionId].candidates.length;
        for (uint256 i = 0; i < candidateCount; i++) {
            if (keccak256(bytes(elections[_electionId].candidates[i].name)) == keccak256(bytes(_candidateName))) {
                return i;
            }
        }
        return candidateCount;
    }


    
    //get candidate votecount
    function getCandidateVoteCount(uint256 _electionId, uint256 _candidateIndex) public view returns (uint256) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        require(_candidateIndex < elections[_electionId].candidates.length, "Candidate does not exist");
        return elections[_electionId].candidates[_candidateIndex].voteCount;
    }
    //end candidate


    //ORG    
    function addOrg(string memory orgName, string memory name, string memory email) public {
        org[msg.sender] = UserOrg(orgName, name, email);
    }    

    
    function isOrg(address orgAddress) public view returns (bool){
        return bytes(org[orgAddress].orgName).length > 0;
    }

    
    function getOrgName(address orgAddress) public view returns (string memory){
        return org[orgAddress].orgName;
    }

    
    function getOrgUserName(address orgAddress) public view returns (string memory){
        return org[orgAddress].userName;
    }

    function getOrgEmail(address orgAddress) public view returns (string memory) {
        return org[orgAddress].email;
    }

    
    function updateOrgDetails(address orgAddress, string memory newOrgName, string memory newUserName, string memory newEmail) public {
        require(isOrg(orgAddress), "Org does not exist");
        org[orgAddress].orgName = newOrgName;
        org[orgAddress].userName = newUserName;
        org[orgAddress].email = newEmail;
    }
    
    

    //End ORG

     function getUserAddress() public view returns (address) {
        return msg.sender;
    }

    //Voter
    function addUser(address userAddress, string memory userName, string memory email) public {
        require(bytes(users[userAddress].userName).length == 0, "User already exists");
        users[userAddress] = User(userName, email, new uint256[](0));
        
    }

    function isUser(address userAddress) public view returns (bool){
        return bytes(users[userAddress].userName).length > 0;
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

    function updateUser(address userAddress, string memory newUserName, string memory newEmail) public {
        require(isUser(userAddress), "User does not exist");
        User storage user = users[userAddress];
        if(bytes(newUserName).length > 0)
            user.userName = newUserName;
        if(bytes(newEmail).length > 0)
            user.email = newEmail;
    }

    

    //end voter


    function getOwnerAddress() public view returns (address) {
        return deployer;
    }

    
    // Vote for multiple candidates in an election
    function Vote(uint256 _electionId, uint256[] memory _candidateIndexes) public {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        Election storage election = elections[_electionId];

        require(election.active, "Election is not active");
        require(!election.hasVoted[msg.sender], "You have already voted");

        for (uint256 i = 0; i < _candidateIndexes.length; i++) {
            election.candidates[_candidateIndexes[i]].voteCount++;
        }

        election.hasVoted[msg.sender] = true;
        users[msg.sender].recentlyVotedIDs.push(_electionId);

        emit Voted(_electionId, _candidateIndexes, msg.sender);
    }

    
    function getRecentlyVotedElectionIDs(address userAddress) public view returns (uint256[] memory) {
        return users[userAddress].recentlyVotedIDs;
    }

    



}
