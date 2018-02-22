import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3'
import _ from 'lodash'
import { Navbar, Jumbotron, Button } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import IpfsAPI from 'ipfs-api'
//const IpfsAPI = require('ipfs-api')

//var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://104.236.58.158:8545"))

var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://104.236.58.158:8545"))

var peopleContractABI = [{"constant":true,"inputs":[],"name":"getPeople","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_firstName","type":"bytes32"},{"name":"_lastName","type":"bytes32"},{"name":"_age","type":"uint256"}],"name":"addPerson","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"people","outputs":[{"name":"firstName","type":"bytes32"},{"name":"lastName","type":"bytes32"},{"name":"age","type":"uint256"}],"payable":false,"type":"function"}]

var reviewContractABI = [{"constant":false,"inputs":[{"name":"_companyName","type":"bytes32"},{"name":"_companyReviewer","type":"bytes32"},{"name":"_companyReview","type":"uint256"}],"name":"addReview","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getReviews","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"reviews","outputs":[{"name":"companyName","type":"bytes32"},{"name":"companyReviewer","type":"bytes32"},{"name":"companyReview","type":"uint256"}],"payable":false,"type":"function"}]


var ipfsContractABI = [{"constant":true,"inputs":[],"name":"getIpfsData","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_addr1","type":"bytes32"},{"name":"_addr2","type":"bytes32"}],"name":"addIpfs","outputs":[{"name":"success","type":"bool"}],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"ipfsrecs","outputs":[{"name":"addr1","type":"bytes32"},{"name":"addr2","type":"bytes32"}],"payable":false,"type":"function"}]


//var UserMessage = '';


//var peopleContractAddress = '0xe2c7e8440f5089011951cb6114c31522ba524638'
var peopleContractAddress = '0xc9a79464fffab1bd9f355a472b3e255f61a68cec'

var reviewContractAddress = '0x993374073fea30f0e354b15bcf95419bf4b84c6a'

var ipfsContractAddress = '0x8d3e374e9dfcf7062fe8fc5bd5476b939a99b3ed'

// 0x993374073fea30f0e354b15bcf95419bf4b84c6a

var peopleContract = ETHEREUM_CLIENT.eth.contract(peopleContractABI).at(peopleContractAddress)
var reviewContract = ETHEREUM_CLIENT.eth.contract(reviewContractABI).at(reviewContractAddress)
var ipfsContract = ETHEREUM_CLIENT.eth.contract(ipfsContractABI).at(ipfsContractAddress)


ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.coinbase;

/*Qme8AMiwMC
MDdxAY6gZ3
8qJkepVkQk
YdPmkUebzD
yiuS1s
*/
//var MyContract = Web3.eth.contract(ABI);
//var myContractInstance = MyContract.at('0x78e97bcc5b5dd9ed228fed7a4887c0d7287344a9');

var peopleEvents = peopleContract.allEvents({fromBlock: 0,toBlock: 'latest'})
var reviewEvents = reviewContract.allEvents({fromBlock: 0,toBlock: 'latest'})


peopleEvents.watch(function (error, results) {
  console.log("zillerium events")
  console.log(results)
})

function ListItem(props) {
  return (
    <li onClick={props.onClick}>
      {props.item}
    </li>
  );
}
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstNames: [],
      lastNames: [],
      ages: [],
      companyNames: ['test'],
      companyReviewers: ['trevor'],
      companyReviews: [0],
       list: ['unicycle', 'juggling clubs', 'stilts'],
       UserMessage:[],
ipfsAddr1:[],
ipfsAddr2:[],
ipfsAddrText:[],
ipfsAddrGlobal:[]

    }
         this.IpfsAPI1 = IpfsAPI('162.243.237.41', '5001', {protocol: 'http', progress: 'false'})
  this.ipfsHost1 = new IpfsAPI({ host: '162.243.237.41', protocol: 'http', port: '5001', 'progress': false });

//  this.IpfsAPI = IpfsAPI('jenbil.com', '5001', {protocol: 'http', progress: 'false'})
//this.ipfsHost = new IpfsAPI({ host: 'jenbil.com', protocol: 'http', port: '5001', 'progress': false });

this.IpfsAPI = IpfsAPI('ipfs.io', '', {protocol: 'http', progress: 'false'})
this.ipfsHost= new IpfsAPI({ host: 'ipfs.io', protocol: 'http', port: '', 'progress': false });






  }

handleThumbsUp() {
  var companyName = document.getElementById("CompanyNameInput").value;
  document.getElementById("CompanyNameInput").value = "";

  var Reviewer = document.getElementById("ReviewerName").value;
  document.getElementById("ReviewerName").value = "";

  var allCompanyNames = this.state.companyNames.slice();
  allCompanyNames.push(companyName);
  this.setState({companyNames: allCompanyNames});

  var allCompanyReviewers = this.state.companyReviewers.slice();
  allCompanyReviewers.push(Reviewer);
  this.setState({companyReviewers:allCompanyReviewers})

  var allCompanyReviews = this.state.companyReviews.slice();
  allCompanyReviews.push(1);
  this.setState({companyReviews:allCompanyReviews})

  reviewContract.addReview(companyName, Reviewer, 1)
  var aMessage = this.state.UserMessage.slice();
    aMessage.push('Your review will be added in a few minutes to the blockchain - please refresh then')
  this.setState({UserMessage:aMessage});
 var a=1;
}

handleThumbsDown() {
  var companyName = document.getElementById("CompanyNameInput").value;
  document.getElementById("CompanyNameInput").value = "";

  var Reviewer = document.getElementById("ReviewerName").value;
  document.getElementById("ReviewerName").value = "";


  var allCompanyNames = this.state.companyNames.slice();
  allCompanyNames.push(companyName);
  this.setState({companyNames: allCompanyNames});

  var allCompanyReviewers = this.state.companyReviewers.slice();
  allCompanyReviewers.push(Reviewer);
  this.setState({companyReviewers:allCompanyReviewers})

  var allCompanyReviews = this.state.companyReviews.slice();
  allCompanyReviews.push(0);
  this.setState({companyReviews:allCompanyReviews})

  reviewContract.addReview(companyName, Reviewer, 0)

  var companyName1 = document.getElementById("CompanyNameInput").value;
  var aMessage = this.state.UserMessage.slice();
    aMessage.push('Your review will be added in a few minutes to the blockchain - please refresh then')
  this.setState({UserMessage:aMessage});
  //reviewContract.addReview("company12", "trevor lee oakley", 1)
}


  addItem() {
    var item = document.getElementById("CompanyNameInput").value;
    document.getElementById("CompanyNameInput").value = "";
    var newList = this.state.list.slice();
    newList.push(item);
    this.setState({list: newList});
  }



  onClick(index) {
    var newList = this.state.list.slice();
    newList.splice(index, 1);
    this.setState({list: newList});
  }
CompanyNameInput
  componentWillMount() {
    console.log(ETHEREUM_CLIENT)
    console.log(peopleContract.getPeople())

    var data = peopleContract.getPeople()
    var reviewData = reviewContract.getReviews()
    var ipfsBCData = ipfsContract.getIpfsData()
    var ipfs1 = String(ipfsBCData[0]).split(',')
    var ipfs2 =  String(ipfsBCData[1]).split(',')



    var ipfsAddressLocalArray = [];
    for (var i = 0; i < ipfs1.length; i++) {
        var aIPDFDataRecHex = ipfs1[i]
          aIPDFDataRecHex=aIPDFDataRecHex.replace('0x','');
          aIPDFDataRecHex=aIPDFDataRecHex.replace('00','');
          var hex  = aIPDFDataRecHex.toString();
    	     var aIPDFDataRec = '';
    	      for (var n = 0; n < hex.length; n += 2) {
    		        aIPDFDataRec += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    	         }
          var addr1 = aIPDFDataRec;
      aIPDFDataRecHex = ipfs2[i]
      aIPDFDataRecHex=aIPDFDataRecHex.replace('0x','');
      aIPDFDataRecHex=aIPDFDataRecHex.replace(/00/g,'');
      var hex  = aIPDFDataRecHex.toString();
    	var aIPDFDataRec = '';
    	for (var n = 0; n < hex.length; n += 2) {
    		aIPDFDataRec += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    	}
      var addr2 = aIPDFDataRec;
      var fulladdr = addr1 + addr2;

fulladdr =     'QmU5KhkgvweYgE3Gsr8A19uFQrq7mszx7dubcoo89cTmAV';

        ipfsAddressLocalArray[i]=fulladdr;


        // products.push({ 'reviewIndex': i, 'ipfsAddr': fulladdr });
       }
//var ipfsTextLocalArray = [];
      /* var ipfsTextLocalArray = [];
       for (var i = 0; i < ipfsAddressLocalArray.length; i++) {
         var fulladdr = ipfsAddressLocalArray[i];
         this.ipfsHost.cat(fulladdr, function(err, stream) {
             var res = ''
             stream.on('data', function (chunk) {
                 res += chunk.toString()
                 ipfsTextLocalArray[i]=res;

             })
             stream.on('error', function (err) {
                 console.error('Oh nooo', err)
             })
             stream.on('end', function () {
                 console.log('Got:', res)

            })

        });
       }
*/
var ipfsTextLocalArray = [];
var ipfsHostLocal = this.ipfsHost;
var ipfsTextLocalArrayFn = function(ipfsAddressLocalArray, ipfsHostLocal) {
    return new Promise((reject, resolve) => {
        var ipfsTextLocalArray = [];
        for (var i = 0; i < ipfsAddressLocalArray.length; i++) {
         var fulladdr = ipfsAddressLocalArray[i];
         ipfsHostLocal.cat(fulladdr, function(err, stream) {
             var res = ''
             stream.on('data', function (chunk) {
                 res += chunk.toString()
                 ipfsTextLocalArray[i]=res;
             })
             stream.on('error', function (err) {
                 console.error('Oh nooo', err);
                 reject(err);
             })
             stream.on('end', function () {
                 console.log('Got:', res)
                 resolve(ipfsTextLocalArray);
            })
          });
        }
    });
}

       ipfsTextLocalArrayFn(ipfsAddressLocalArray, ipfsHostLocal)
       .then((response)=>{
           console.log('the reponse with ipfsTextLocalArray', response);
       })
       .catch((err)=>{
           console.log('err', err);
       });

  //  reviewContract.addReview("company1", "trevor lee oakley", 1)

    this.setState({
      firstNames: String(data[0]).split(','),
      lastNames: String(data[1]).split(','),
      ages: String(data[2]).split(','),

      companyNames: String(reviewData[0]).split(','),
      companyReviewers: String(reviewData[1]).split(','),
      companyReviews: String(reviewData[2]).split(','),
    //  ipfsAddr1: String(ipfsBCData[0]).split(','),
  //    ipfsAddr2: String(ipfsBCData[1]).split(',')
  ipfsAddrText: String(ipfsTextLocalArray[0]).split(','),
ipfsAddrGlobal:  String(ipfsAddressLocalArray[0]).split(','),

    })
  }
  render() {
    var listItems = [];
    this.state.companyNames.forEach((item, i) => {
      listItems.push(<ListItem item={item} onClick={() => this.onClick(i)} />)
    });


    var listItems2 = [];
    this.state.list.forEach((item, i) => {
      listItems2.push(<ListItem item={item} onClick={() => this.onClick(i)} />)
    });
var ShowMessage = [];
    this.state.UserMessage.forEach((item, i) => {
        ShowMessage.push(<p className = "jenbil-warn">{item}</p>);
    });





    var companyList =[];

    var TableRows = []
    _.each(this.state.firstNames, (valucompanyNamese, index) => {
      TableRows.push(
        <tr>
        <td>{ETHEREUM_CLIENT.toAscii(this.state.firstNames[index])}</td>
        <td>{ETHEREUM_CLIENT.toAscii(this.state.lastNames[index])}</td>
        <td>{this.state.ages[index]}</td>
        </tr>
      )
    })

    var products =[];
    var reviewIndexArray = [];

    for (var i = 0; i < this.state.ipfsAddrGlobal.length; i++) {
        products.push({ 'reviewIndex': i, 'ipfsAddr': this.state.ipfsAddrGlobal[i], 'ipfsText': this.state.ipfsAddrText[i]  });
       }


       // curl "http://127.0.0.1:5001/api/v0/object/get?arg=QmU5KhkgvweYgE3Gsr8A19uFQrq7mszx7dubcoo89cTmAV
     const multihashStr = 'QmU5KhkgvweYgE3Gsr8A19uFQrq7mszx7dubcoo89cTmAV' // here just once
  //     this.ipfsHost.cat(multihashStr, function(err, res) {
//                  if(err || !res) return console.error("ipfs cat error", err, res);
//                  if(res.readable) {
//                         console.error('unhandled: cat result is a pipe', res);
//                   } else {
//                         console.log("Inside Printing");
//
//                          console.log(multihashStr);
//                            console.log(res);
//
//
//                    }
//      });

      this.ipfsHost.cat(multihashStr, function(err, stream) {

                    var res = ''

                  stream.on('data', function (chunk) {
                                    res += chunk.toString()
                  })

              stream.on('error', function (err) {
                     console.error('Oh nooo', err)
            })

           stream.on('end', function () {
                      console.log('Got:', res)
          })

      });



/*

       this.IpfsAPI.get(multihashStr, function (err, stream) {
         stream.on('data', (file) => {
           // write the file's path and contents to standard out
           console.log(file.path)
           file.content.pipe(process.stdout)
         })
       })

*/
/*var zstr = "Hello from trevor at Zillerium 2"
       this.ipfsAPI.add(new Buffer(zstr), function (err, res){
              console.log("hello");
              if(err || !res) return console.error("ipfs add error", err, res);
              else{
//                console.log("no issue");
//                console.log(res);
                res.forEach(function(text) {
                       console.log('successfully stored', text.hash);
                     //  console.log('successfully stored', text.path);
                     //  display(file.Hash);
                        var textaddress=text.hash;
                        console.log(textaddress);
                });
              }
            });
*/

/*
       this.IpfsAPI.add([new Buffer('hello world from Zillerium')]).then((res) => {
       // do something with res
       console.log(res);

    //   var ipfsId = res[0].hash;
    //   console(ipfsId);
     }).catch((err) => { console.log("error in api call ") })
*/
products.reverse();
       var tableHtml =
    <BootstrapTable data={products} striped={true} hover={true}>
        <TableHeaderColumn dataField="reviewIndex" isKey={true} dataAlign="center" dataSort={true}>Review ID</TableHeaderColumn>
          <TableHeaderColumn dataField="ipfsAddr"  dataAlign="center" dataSort={true}>Ipfs Address</TableHeaderColumn>
          <TableHeaderColumn dataField="ipfsText"  dataAlign="center" dataSort={true}>Ipfs Text</TableHeaderColumn>

       </BootstrapTable>




    return (
      <div className="App">
        <div className="App-header">

          <h2>Zillerium Demo (IPSF on the blockchain)</h2>

        </div>Reviews
  <div  className="App-Content">

  <input
       type="text"
       id="CompanyNameInput"
       placeholder="Company Name"

       name="filtertext"
   />
   <input
        type="text"
        id="ReviewerName"
        placeholder="Your Name"

        name="filtertext"
    />
           <button type="button" className="btn btn-link" onClick={() => this.handleThumbsUp()}><span className="glyphicon glyphicon-thumbs-up"></span></button>
           <button type="button" className="btn btn-link" onClick={() => this.handleThumbsDown()}><span className="glyphicon glyphicon-thumbs-down"></span></button>
{ShowMessage}
<div>

</div>

        <p className="App-intro">
          Add your review to ISPF and the Blockchain. It takes a few minutes to update the blockchain according to the mining.

        </p>





{tableHtml}






        </div>

      </div>
    );
  }
}

export default App;
