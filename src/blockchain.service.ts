import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

// const contractAddress = '0xcad6bcde9df00077ee58842ccff5ba1d5570ef69';
const contractAddress = '0x1F62C7bf9b5af2C3726A6F1730AA7C2478AB7C5d';
const contractABI: any = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "electionId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "CandidateAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "electionId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "ElectionCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "electionId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "candidateIndex",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        }
      ],
      "name": "Voted",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "electionCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "elections",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "startDate",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "endDate",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "domainFilter",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "org",
      "outputs": [
        {
          "internalType": "string",
          "name": "orgName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "userName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "email",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "ownedElections",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "electionId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "electionName",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "users",
      "outputs": [
        {
          "internalType": "string",
          "name": "userName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "email",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_startDate",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_endDate",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_domainFilter",
          "type": "string"
        }
      ],
      "name": "createElection",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_newName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_startDate",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_endDate",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_newDomainFilter",
          "type": "string"
        }
      ],
      "name": "updateElectionDetails",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "organizer",
          "type": "address"
        }
      ],
      "name": "getOwnedElections",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "electionId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "electionName",
              "type": "string"
            }
          ],
          "internalType": "struct DecentralizedVoting.CreatedElections[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "organizer",
          "type": "address"
        }
      ],
      "name": "getOwnedElectionIds",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "organizer",
          "type": "address"
        }
      ],
      "name": "getOwnedElectionNames",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "organizer",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "getElectionIdByName",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        }
      ],
      "name": "getElectionResults",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        }
      ],
      "name": "getElectionName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        }
      ],
      "name": "closeElection",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getElectionNames",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        }
      ],
      "name": "getElectionStartDate",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        }
      ],
      "name": "getElectionEndDate",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        }
      ],
      "name": "getElectionDomainFilter",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        }
      ],
      "name": "getElectionStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_candidateName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_candidatePosition",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_platform",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_cdn",
          "type": "string"
        }
      ],
      "name": "addCandidate",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_newName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_newPosition",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_newPlatform",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_newcdn",
          "type": "string"
        }
      ],
      "name": "updateCandidateInfo",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "deleteCandidate",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        }
      ],
      "name": "getCandidatesCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "getCandidateName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "getCandidatePosition",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "getCandidatePlatform",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "getCandidateCdn",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        }
      ],
      "name": "getCandidateNames",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_candidateName",
          "type": "string"
        }
      ],
      "name": "getCandidateIDbyName",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "getCandidateVoteCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "orgName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "email",
          "type": "string"
        }
      ],
      "name": "addOrg",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "orgAddress",
          "type": "address"
        }
      ],
      "name": "isOrg",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "orgAddress",
          "type": "address"
        }
      ],
      "name": "getOrgName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "orgAddress",
          "type": "address"
        }
      ],
      "name": "getOrgUserName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "orgAddress",
          "type": "address"
        }
      ],
      "name": "getOrgEmail",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "orgAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "newOrgName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "newUserName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "newEmail",
          "type": "string"
        }
      ],
      "name": "updateOrgDetails",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getUserAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "userName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "email",
          "type": "string"
        }
      ],
      "name": "addUser",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        }
      ],
      "name": "isUser",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        }
      ],
      "name": "getUserName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        }
      ],
      "name": "getEmail",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "newUserName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "newEmail",
          "type": "string"
        }
      ],
      "name": "updateUser",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getOwnerAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_electionId",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "_candidateIndexes",
          "type": "uint256[]"
        }
      ],
      "name": "Vote",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        }
      ],
      "name": "getRecentlyVotedElectionIDs",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  public provider: ethers.BrowserProvider | undefined;
  public signer: ethers.Signer | undefined;
  public contract: ethers.Contract | undefined;


  constructor() { }

  async loadBlockchain(){
    if ((window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
      this.signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(contractAddress, contractABI, this.signer);
    }else{
      console.log('Please install MetaMask');
    }
  }

  async createElection(name: string, startDate: string, endDate: string, domainFilter: string){
    if (!this.contract) return;
    const tx = await (this.contract as any).createElection(name, startDate, endDate, domainFilter); 
    await tx.wait();
  }

  async closeElection(electionID: number){
    if (!this.contract) return;
    // try{
      const tx = await (this.contract as any).closeElection(electionID);
      await tx.wait();     
    // }catch (error){
      
    //   console.log(error);
    // }
  }

  async getElectionNames(): Promise<string[]> {
    if (!this.contract) return [];
    try {
      const electionNames = await (this.contract as any).getElectionNames();
      console.log("Election Names:", electionNames);
      return electionNames;
    } catch (error) {
      console.error("Error fetching election names:", error);
      return [];
    }
  }

  async getElectionName(electionID: number):Promise <string> {
    if (!this.contract) return '';
    try{
      const electionName = await (this.contract as any).getElectionName(electionID);
      return electionName;
    }catch (error){
      console.log(error);
      return '';
    }
  }

  async getElectionResults(electionID: number){
    if (!this.contract) return;
    const result = await (this.contract as any).getElectionResults(electionID);
    return result;
  }

  async updateElectionDetails(electionID: number, name: string, startDate: string, endDate: string, domainFilter: string){
    if (!this.contract) return;
    const tx = await (this.contract as any).updateElectionDetails(electionID, name, startDate, endDate, domainFilter);
    await tx.wait();
  }

  async getElectionStartDate(electionID: number){
    if (!this.contract) return;
    const result = await (this.contract as any).getElectionStartDate(electionID);
    return result;
  }

  async getElectionEndDate(electionID: number){
    if (!this.contract) return;
    const result = await (this.contract as any).getElectionEndDate(electionID);
    return result;
  }

  async getElectionDomainFilter(electionID: number){
    if (!this.contract) return;
    const result = await (this.contract as any).getElectionDomainFilter(electionID);
    return result;
  }

  async getElectionStatus(electionID: number){
    if (!this.contract) return;
    const result = await (this.contract as any).getElectionStatus(electionID);
    return result;
  }

  async updateElection(electionID: number, name: string, startDate: string, endDate: string, domainFilter: string){
    if (!this.contract) return;
    const tx = await (this.contract as any).updateElectionDetails(electionID, name, startDate, endDate, domainFilter);
    await tx.wait();
  }


  //End Election


  //Candidate

  async addCandidate(electionID: number, candidateName: string, position: string, platform: string, cdn: string){
    if (!this.contract) return;
    const tx = await (this.contract as any).addCandidate(electionID, candidateName, position, platform, cdn);
    await tx.wait();
  }

  async getCandidatesCount(electionID: number){
    if (!this.contract) return;
    const result = await (this.contract as any).getCandidatesCount(electionID);
    return result;
  }

  

  async getCandidates(electionID: number):Promise <string[]> {
    if (!this.contract) return [];
    try{
      const candidates = await (this.contract as any).getCandidateNames(electionID);
      return candidates;
    }catch (error){
      console.log(error);
      return [];
    }
  }

  async getCandidatePosition(electionID: number, candidateID: number){
    if (!this.contract) return;
    const result = await (this.contract as any).getCandidatePosition(electionID, candidateID);
    return result;
  }

  async getCandidateName(electionID: number, candidateID: number){
    if (!this.contract) return;
    const result = await (this.contract as any).getCandidateName(electionID, candidateID);
    return result;
  }

  async getCandidatePlatform(electionID: number, candidateID: number){
    if (!this.contract) return;
    const result = await (this.contract as any).getCandidatePlatform(electionID, candidateID);
    return result;
  }

  async getCandidateCdn(electionID: number, candidateID: number){
    if (!this.contract) return;
    const result = await (this.contract as any).getCandidateCdn(electionID, candidateID);
    return result;
  }

  async deleteCandidate(electionID: number, candidateID: number){
    if (!this.contract) return;
    const tx = await (this.contract as any).deleteCandidate(electionID, candidateID);
    await tx.wait();
  }

  async updateCandidate(electionID: number, candidateID: number, candidateName: string, position: string, platform: string, cdn: string){
    if (!this.contract) return;
    const tx = await (this.contract as any).updateCandidateInfo(electionID, candidateID, candidateName, position, platform, cdn);
    await tx.wait();
  }

  async getCandidateIDByName(electionID: number, candidateName: string): Promise<number> {
    if (!this.contract) return -1;
    try {
      const result = await (this.contract as any).getCandidateIDbyName(electionID, candidateName);
      return result;
    } catch (error) {
      console.error("Error getting candidate ID:", error);
      return -1;
    }
  }

async getCandidateVoteCount(electionID: number, candidateID: number): Promise<number> {
  if (!this.contract) return 0;
  try {
    const result = await (this.contract as any).getCandidateVoteCount(electionID, candidateID);
    return result;
  } catch (error) {
    console.error("Error getting candidate vote count:", error);
    return 0;
  }
}


  

  
  //ORG
  async addOrg(orgName: string, name: string, email: string){
    if (!this.contract) return;
    try{
      const tx = await (this.contract as any).addOrg(orgName, name, email);
      await tx.wait();
    }catch(error){
      
    }
  }

  async isOrg(orgAddress: string): Promise<boolean> {
    if (!this.contract) return false;
    try {
      const result = await (this.contract as any).isOrg(orgAddress);
      return result;
    } catch (error) {
      console.error("Error user exists:", error);
      return false;
    }
  }

  async getOrgName(orgAddress: string): Promise<string> {
    if (!this.contract) return "";
    try {
      const result = await (this.contract as any).getOrgName(orgAddress);
      return result;
    } catch (error) {
      console.error("Error getting org name:", error);
      return "";
    }
  }

  async getOrgUserName(orgAddress: string): Promise<string> {
    if (!this.contract) return "";
    try {
      const result = await (this.contract as any).getOrgUserName(orgAddress);
      return result;
    } catch (error) {
      console.error("Error getting org name:", error);
      return "";
    }
  }

  async getOrgEmail(orgAddress: string): Promise<string> {
    if (!this.contract) return "";
    try {
      const result = await (this.contract as any).getOrgEmail(orgAddress);
      return result;
    } catch (error) {
      console.error("Error getting org name:", error);
      return "";
    }
  }
  //END ORG

  //USER
  async addUser(userAddress: string, userName: string, email: string){
    if (!this.contract) return;
    try{
      const tx = await (this.contract as any).addUser(userAddress, userName, email);
      await tx.wait();     
    }catch (error){
      console.log(error);
      return;
    }
  }

  async userExists(userAddress: string): Promise<boolean> {
    if (!this.contract) return false;
    try {
      const result = await (this.contract as any).isUser(userAddress);
      return result;
    } catch (error) {
      console.error("Error user exists:", error);
      return false;
    }
  }

  async getUserAddress(): Promise<string> {
    if (!this.contract) return "";
    try {
      const result = await (this.contract as any).getUserAddress();
      return result;
    } catch (error) {
      console.error("Error getting user:", error);
      return "";
    }    

  }


  async getEmail(userAddress: string): Promise<string> {
    if (!this.contract) return "";
    try {
      const result = await (this.contract as any).getEmail(userAddress);
      return result;
    } catch (error) {
      console.error("Error getting email:", error);
      return "";
    }    

  }

  async getUsername(userAddress: Promise<string>) {
    if (!this.contract) return "";
    try {
      const result = await (this.contract as any).getUserName(userAddress);
      return result;
    } catch (error) {
      console.error("Error getting username:", error);
      return "";
    }    
  }

async getMyRecentElectionIds(): Promise<number[]> {
  if (!this.contract) return [];
  try {
    const address = await this.getUserAddress();
    const result = await (this.contract as any).getRecentlyVotedElectionIDs(address);
    return result;
  } catch (error) {
    console.error("Error fetching recent election IDs:", error);
    return [];
  }
}


  //END USER

  async getElectionIDbyName(name: string): Promise<number> {
    if (!this.contract) return 0;
    try {
      const address = await this.getUserAddress();
      const result = await (this.contract as any).getElectionIdByName(address,name);
      return result;
    } catch (error) {
      console.error("Error getting election ID:", error);
      return 0;
    }    
  }

  async getOwnedElectionNames(): Promise<string[]> {
    if (!this.contract) return [];
    try {
      const address = await this.getUserAddress();
      const result = await (this.contract as any).getOwnedElectionNames(address);
      return result;
    } catch (error) {
      console.error("Error getting owned election names:", error);
      return [];
    }
  }

async vote(electionId: number, candidateIndexes: number[]): Promise<void> {
  if (!this.contract) return;
  
    const tx = await (this.contract as any).Vote(electionId, candidateIndexes);
    await tx.wait();
  
}



}
