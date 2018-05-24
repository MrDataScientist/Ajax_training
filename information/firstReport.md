
Development environment for an Ethereum project:

### Windows

1. Download Python:
 https://www.python.org/downloads/release/python-2712/

2. .Net Packages
 https://www.microsoft.com/en-US/download/details.aspx?id=49982

 https://www.microsoft.com/en-us/download/details.aspx?id=30653

3. SSL
 https://slproweb.com/products/Win32OpenSSL.html

4. and eventually you also need the Visual Studio, because of the C++ Compiler:
 https://www.visualstudio.com/vs/

 After downloading the Visual Studio make sure to open one time _a new c++ project_.

5. Install the Git-Bash as it comes with a mingw:
 https://git-scm.com/downloads

6. Install NodeJS and the Node Package Manager (NPM)
 https://nodejs.org/en/download/

7.### Install

Install [testrpc] (or use geth) 

```
$ npm install -g ethereumjs-testrpc
```

Install [truffle](https://github.com/consensys/truffle):

```
$ npm install -g truffle@2.0.4
```
### Run

Run testrpc in one console window:

```
$ testrpc
```
In another console window run truffle from project root directory:

```
$ truffle compile
$ truffle migrate
$ truffle test
$ truffle serve // server at localhost:8080

Ether vs Gas vs Wei 
1: wei
10^3: (unspecified)
10^6: (unspecified)
10^9: (unspecified)
10^12: szabo
10^15: finney
10^18: ether 

RESOURCES
Beginner “What is Ethereum?” links:
1. http://truffleframework.com/tutorials/ethereum-overview
2. https://dappsforbeginners.wordpress.com/tutorials/introduction-to-development-on-ethereum/
Beginner “Dev Setup” links:
1. http://truffleframework.com/tutorials/how-to-install-truffle-and-testrpc-on-windows-for-bloc kchain-development
2. http://truffleframework.com/tutorials/building-testing-frontend-app-truffle-3
Beginner “Dapp Development” links:
1. http://truffleframework.com/tutorials/truffle-and-metamask
2. http://truffleframework.com/tutorials/pet-shop
3. https://github.com/truffle-box

Key concepts:
DAPP / Smart Contracts
A Dapp is a ‘blockchain enabled’ website, where the Smart Contract is what allows it to connect to the blockchain.
The easiest way to understand this is to understand how traditional websites operate.
The traditional web application uses HTML, CSS and javascript to render a page. It will also need to grab details from a database utilizing an API . When you go onto Facebook, the page will call an API to grab your personal details and display them on the page.
You can think of a website like this:

Front End → API → Database

A Dapp is very similar to a traditional web application. The front end uses the exact same technology to render the page. The one critical difference is that instead of an API connecting to a Database, you have a Smart Contract connecting to a blockchain.
You can think of a Dapp like this:

Front End → Smart Contract → Blockchain

While a simplified version of what’s happening, this does illustrate that Smart Contracts are playing the role of the ‘api connector’ to the blockchain.



What is MetaMask and why is it important

MetaMask[1] is a browser plugin that allows users to make Ethereum transactions through regular websites. It facilitates the adoption of Ethereum because it bridges the gap between the user interfaces for Ethereum (eg. Mist browsers, Dapps) and the regular web (eg. Chrome, Firefox, websites). Without this, Ethereum cannot become mainstream because the regular web has a strong network effect which inhibits the average user from switching.

Ethereum vs the Regular Web

Suppose you want to use Ethereum to buy a pair of socks from Amazon. The regular web puts Amazon’s servers at the focus: Your browser makes HTTP requests to it for the webpage and sends your payment details to it. However, Ethereum is decentralized. To pay you would have to write your transaction on the Ethereum blockchain through any Ethereum node (could be on your computer or elsewhere) and broadcast it across the network. Amazon would then look at the blockchain to check that Ether has been transferred from your account into its own.
At the moment, regular web browsers don’t know how to connect to an Ethereum node and read or write to the Ethereum blockchain so you would have to start up your Mist browser and fiddle with little details like eth addresses to make the payment. This is where MetaMask comes in.

Enter MetaMask

MetaMask injects a javascript library called web3.js into the namespace of each page your browser loads. web3.js is written by the Ethereum core team, and has functions that regular webpages can use to make read and write requests on the blockchain that are consistent with the existing protocol [2].
Furthermore, MetaMask allows users to specify which Ethereum node to send these requests to. The ability to send requests to nodes outside of the user’s computers is important because it means that people can use Ethereum without having to download a node consisting the 10+GB blockchain on to their computers.



# truffle-init-webpack
Example webpack project with Truffle. Includes contracts, migrations, tests, user interface and webpack build pipeline.

## Usage

To initialize a project with this exapmple, run `truffle init webpack` inside an empty directory.

## Building and the frontend

1. First run `truffle compile`, then run `truffle migrate` to deploy the contracts onto your network of choice (default "development").
1. Then run `npm run dev` to build the app and serve it on http://localhost:8080

## Possible upgrades

* Use the webpack hotloader to sense when contracts or javascript have been recompiled and rebuild the application. Contributions welcome!

## Common Errors

* **Error: Can't resolve '../build/contracts/MetaCoin.json'**

This means you haven't compiled or migrated your contracts yet. Run `truffle compile` and `truffle migrate` first.

Full error:

```
ERROR in ./app/main.js
Module not found: Error: Can't resolve '../build/contracts/MetaCoin.json' in '/Users/tim/Documents/workspace/Consensys/test3/app'
 @ ./app/main.js 11:16-59
```

Be careful when you use truffle on windows : it create  a conflict with the name
so instead of using truffle as a cmd directly
be specific and use this as a cmd : truffle.cmd



# Ethereum decentralized applications (commerce platform)
USE CASE FOR BLOCKCHAIN TECHNOLOGY

https://swarm.city
https://akasha.world
https://gnosis.pm
https://ethlance.com
https://bitnation.co
https://alice.si

this company used the blockchain tech to power its cloud storage technology
https://storj.io

this company aim to bring the smart contract technology into the market
https://www.rootstack.com

DAPP: (27/10/2017)
http://weifund.io : smart contract technology that allow people to crow fund projects
https://augur.net/ : Decentralized  network to predict a market


# Technologies
Ethereum
the Inter-Planetary File System 
https://ipfs.io
https://en.wikipedia.org/wiki/InterPlanetary_File_System
















Smart contract:
how the constructor, basic setters, and getters work?
Compiler : Remix IDE
link: http://ethereum.github.io/browser-solidity/#version=soljson-v0.4.0+commit.acd334c9.js

pragma solidity ^0.4.0;

contract MyContract {
    
    uint myVariable;
    
    function MyContract(){
        myVariable = 5;
    }
    
    function setMyVariable(uint MyNewVariable){
        myVariable = MyNewVariable;
    }
    
    function getMyVariable() constant returns(uint){
        return myVariable;
    }
    
}



keyword payable (so you can send a contract)
keyword modifier()
anonymous function, example: (it s also called fallback function/ in order to send ether to this function you also need to make it payable)
function () {}



pragma solidity ^0.4.0;
contract MyContract {
    uint myVariable;
    function MyContract() payable{
        myVariable = 5;
    }
    function setMyVariable(uint MyNewVariable){
        myVariable = MyNewVariable;
    }
    function getMyVariable() constant returns(uint){
        return myVariable;
    }
    
    function getMyContractBalance() constant returns(uint){
        return this.balance;
    }
    //this is an anonymous function and  it also called fallback function
    function () {  
    }
}


How to kill a contract?
pragma solidity ^0.4.0;

contract MyContract {
    
    uint myVariable;
    address owner;
    
    //the owner is the message sender // who is the person who is just deploying the contract
    function MyContract() payable{
        myVariable = 5;
        owner = msg.sender;
    }
    
    function setMyVariable(uint MyNewVariable){
        if(msg.sender == owner){
          myVariable = MyNewVariable;          
        }
    }
    
    function getMyVariable() constant returns(uint){
        return myVariable;
    }
    
    function getMyContractBalance() constant returns(uint){
        return this.balance;
    }
    
    // this is how  to kill the contract
    function kill(){
        // make a white list and a black list??
        if(msg.sender == owner){
        suicide(owner);
        } else {
            throw;
        }
    }
    
    //this is an anonymous function and  it also called fallback function
    function () payable{
        
    }
}


What is a modifier and how it works? +Inheritance
pragma solidity ^0.4.0;

contract mortal{
 
 address owner;
 
 modifier onlyowner(){
 if(owner == msg.sender){
 _;
 } else {
 throw;
 }
 }
 
 function mortal(){
 owner = msg.sender;
 }
 
 function kill() onlyowner{
 suicide(owner);
 }
}


pragma solidity ^0.4.0;

import "mortal.sol";

contract MyContract is mortal{
    
    uint myVariable;
    
    //the owner is the message sender // who is the person who is just deploying the contract
    function MyContract() payable{
        myVariable = 5;
    }
    
    //onlyowner : solidity will take onlyowner modifier
    function setMyVariable(uint MyNewVariable) onlyowner{
        if(msg.sender == owner){
          myVariable = MyNewVariable;          
        }
    }
    
    function getMyVariable() constant returns(uint){
        return myVariable;
    }
    
    function getMyContractBalance() constant returns(uint){
        return this.balance;
    }
    
    //this is an anonymous function and  it also called fallback function
    function () payable{
        
    }
}


Best online courses about blockchain technologies:

How to create global variable?
http://solidity.readthedocs.io/en/develop/units-and-global-variables.html
smart contract development
https://guide.blockchain.z.com/en/docs/dapp/
udemy courses:
https://www.udemy.com/blockchain-developer/learn/v4/overview
https://www.udemy.com/ethereum-developer/learn/v4/overview

MetaMask
http://truffleframework.com/tutorials/truffle-and-metamask


List of Errors :

1) fsevent is not a constructor ??
2) truffle.cmd to run the program (don't use truffle without the extension)
3) test
4)	eth.web3.compile() doesnt work anymore
5) Invalid JSON RPC response
possible solution: Got it. Damn to updates! Now Remix does not reset field value after compilation so it tries to deploy contract and send amount to constructor. Solution is simple: reset value field before click Run. 

6) gas limit exceeded
7) Uncaught TypeError: t.abi.filter is not a function
solution: the  ABI needs to be defined as an Array not as a String



TIPS & TRICKS

Here are some tips I learned by teaching myself solidity (kind of the only way to do it right now). They should help you learn at a quicker pace. The list is summarized below with links: 

1. Keep your dev environment simple a. Start using the Solidity remix IDE: https://remix.ethereum.org
2. Keep the first few smart contracts you write simple 

a. Avoid doing lots of calculations within your smart contract 
b. Don't worry about calling outside contracts at the start 
c. Look at simple smart contracts to help for reference 

3. Don't worry about blockchain and solidity specific technicalities for your first few smart contracts, such as: 

a. gas limit 
b. block times 
c. integer overflow and underflow 
d. storage cost 

4. Don't worry about downloading a bunch of software at once, add one new piece at a time, such as: a. truffle 
b. testrpc 
c. metamask 

5. Don't worry about making your smart contract secure right away. once you get a few simple ones done, then look to here https://github.com/ConsenSys/smart-co... to start building secure contracts 6. Read the Solidity documentation: http://solidity.readthedocs.io/en/dev...


Courses:
In response, BlockApps offers a course to cover:
Ethereum – Fundamentals of Ethereum blockchain and the Ethereum Virtual Machine (EVM)
Solidity – A javascript-like programming language used to write “Smart Contracts”
STRATO – Build and deploy smart contract applications quickly
Prototype – Deploy a working Blockchain application based on a supply chain use-case






Project 1 : Prototypical Development of a FinTech Blockchain Trading Platform “SwapDapp”

- based on the Geth / Go Ethereum Framework (incl. Ether - Pudding, Truffle, Whisk, Web3 JS API) and 
implemented in HTML 5, CSS3, NodeJS, Bootstrap, JavaScript, Facebook React/DOM/Router/Redux, JQuery, AJAX, Linux, GIT and Solidity

Developed a trading platform for a class of OTC-derivatives : interest rate swaps by means of the Blockchain technology 

- Complex smart contracts were deployed onto the Blockchain

- Master agreement legal documents were produced upon contract agreement and hash code verification for authentication purposes created as to avoid legal disputes 


KEYWORDS:
https://lunyr.com/#lunyr
https://medium.com/@cryptojudgement/lunyr-decentralized-wikipedia-on-the-blockchain-4072606d5fc5



#lunyr #blockchain #Dapps #Crowdsale #Ethereum

INFORMATIONS:



40down voteaccepted
The Ethereum blockchain was designed to be entirely deterministic. This means, that if I took the whole history of the network, then replayed it on my computer, I should always end up with the correct state.
Since the internet is non-deterministic and changes over time, then every time I replayed all of the transactions on the network, I would receive a different answer.
Determinism is important so that nodes can come to a consensus. If there were a contract that required the number of upvotes on this question, the value could differ from time to time or even place to place, causing nodes in the future or without access to this site to reach different conclusions about the state of the network, thus breaking the consensus.
By requiring that every data input is initiated through an external transaction, we can be sure that the blockchain itself contains all of the information required to verify itself. By using a single contract-level oracle (https://oraclize.it) instead of a network or consensus-level feature, we ensure that there is only one canonical result.


Blockchain platforms for developers:

https://monax.io
Banks platform//
http://coloredcoins.org





BIGCHAINDB : (IPDB)

it's a big data database with some blockchain characteristics.

