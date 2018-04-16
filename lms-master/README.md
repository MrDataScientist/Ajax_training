# LMS: A community library management system
[![Build Status](https://travis-ci.org/Imaginea/lms.svg?branch=master)](https://travis-ci.org/Imaginea/lms)

## Overview

In this project we aim to create a peer to peer virtual library in a decentralized network, where every user can pool his/her books in the community. It is implemented on the Ethereum blockchain using Solidity, Truffle, Zeppelin and Node.js. 

This project could have been built with a legacy tech stack but we chose Blockchain just to get familiar with it's Ecosystem and development process. With the current architecture it doesn't exploit all properties of Blockchain.


## Quickstart

1. Clone the repo
2. install testrpc  `npm install -g ethereumjs-testrpc` and truffle `npm install truffle@3.2.5 -g`
3. Go to project dir and run `npm install`
4. Run command - `testrpc` 
5. Run `truffle compile`, then run `truffle migrate` to deploy the contracts onto your network of choice (default "development").
6. Then run `npm start` to build the app and serve it on http://localhost:8080

## Debugging

```
$ truffle console
truffle(development)> compile
truffle(development)> lms.new('Owner name')
```
If getOwner is a constant function, you will get the output immediately on the console
```
truffle(development)> lms.at("contract address").getOwner()   
```
if getOwner is not a constant function, use events (say Owner is an event).
```
truffle(development)> lms.at('contract address').getOwner()
truffle(development)> lms.at('contract address').Owner(function (e, result) { if (!e) {console.log(result)}})
```
Note: Don't forget to add any new contracts to the migration file.

## Contribution

We welcome contributions to this project, please feel free to raise PRs or Issues.

Fork -> Edit -> Submit pull requests.
