# BlockVote

BlockChain-Based Voting System using Angular 19

## Instructions
0. Use Terminal targeting the project folder.

1. Install Ethers.js
```bash
npm i ethers
```

2. Install Truffle
```bash
npm i truffle
```

3. Install Angular Material
```bash
ng add @angular/material
```

4. Install EmailJS
```bash
npm install --save @emailjs/browser
```

5. Install UploadCare
```bash
npm i @uploadcare/file-uploader
```

6. Install Ganache
link: https://archive.trufflesuite.com/ganache/



## How to run
0. Run ganache (create a workspace)

1. Copy this code and paste to truffle-config.js

```bash
const path = require("path");

module.exports = {
  
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  
  networks: {
    development: {
      network_id: "*",
      host: "127.0.0.1",
      port: 7545,
      gas: 6721975,
      gasPrice: 20000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.20", 
      
    }
  },
};
```

2. Go to contracts folder using terminal.
```bash
truffle compile
```

3. Then copy this code then paste to truffle-config.js

```bash
const path = require("path");

module.exports = {
  
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  
  networks: {
    development: {
      network_id: "*",
      host: "127.0.0.1",
      port: 7545,
      gas: 6721975,
      gasPrice: 20000000000,
    },
  },
  
};
```

4. Go to terminal again
```bash
truffle migrate --reset
```

5. Copy ABI from contract/client/src/contracts/DecentralizedVoting.json and paste to contractABI array variable in blockchain.service.ts

6. Copy Smart Contract Address from terminal and replace the contractAddress value. 

7. Install and open Metamask and import account from Ganache.


8. To start a local development server, run:

```bash
ng serve
```
