import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

const contractAddress = '0x81a1459313397FCab6503C2192166c1735d3bcaC';
const contractABI: any = [
  {
    "inputs": [],
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
        "internalType": "uint256",
        "name": "candidateIndex",
        "type": "uint256"
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
    "inputs": [],
    "name": "electionCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
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
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
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
    "stateMutability": "view",
    "type": "function"
  },
  {
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
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
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
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getUserAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
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
    "stateMutability": "view",
    "type": "function"
  },
  {
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
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOwnerAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "createElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
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
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
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
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
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
    "stateMutability": "view",
    "type": "function"
  },
  {
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
    "stateMutability": "view",
    "type": "function"
  },
  {
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
    "stateMutability": "view",
    "type": "function"
  },
  {
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
    "stateMutability": "view",
    "type": "function"
  },
  {
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
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_electionId",
        "type": "uint256"
      }
    ],
    "name": "closeElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getElectionNames",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
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

  async createElection(name: string){
    if (!this.contract) return;
    const tx = await (this.contract as any).createElection(name);
    await tx.wait();
  }

  async addCandidate(electionID: number, candidateName: string){
    if (!this.contract) return;
    const tx = await (this.contract as any).addCandidate(electionID, candidateName);
    await tx.wait();
  }

  async vote(electionID: number, candidateIndex: number){
    if (!this.contract) return;
    const tx = await (this.contract as any).vote(electionID, candidateIndex);
    await tx.wait();
  }

  async getCandidatesCount(electionID: number){
    if (!this.contract) return;
    const result = await (this.contract as any).getCandidatesCount(electionID);
    return result;
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

  async closeElection(electionID: number){
    if (!this.contract) return;
    try{
      const tx = await (this.contract as any).closeElection(electionID);
      await tx.wait();     
    }catch (error){
      console.log(error);
    }
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

  async addUser(userAddress: string, userName: string, email: string){
    if (!this.contract) return;
    try{
      const tx = await (this.contract as any).addUser(userAddress, userName, email);
      await tx.wait();     
    }catch (error){
      console.log(error);
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


}
