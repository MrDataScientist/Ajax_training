import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3'
import _ from 'lodash'
import { Navbar, Jumbotron, Button } from 'react-bootstrap';

var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://104.236.58.158:8545"))
var peopleContractABI = [{"constant":true,"inputs":[],"name":"getPeople","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_firstName","type":"bytes32"},{"name":"_lastName","type":"bytes32"},{"name":"_age","type":"uint256"}],"name":"addPerson","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"people","outputs":[{"name":"firstName","type":"bytes32"},{"name":"lastName","type":"bytes32"},{"name":"age","type":"uint256"}],"payable":false,"type":"function"}]

var reviewContractABI = [{"constant":false,"inputs":[{"name":"_companyName","type":"bytes32"},{"name":"_companyReviewer","type":"bytes32"},{"name":"_companyReview","type":"uint256"}],"name":"addReview","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getReviews","outputs":[{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"reviews","outputs":[{"name":"companyName","type":"bytes32"},{"name":"companyReviewer","type":"bytes32"},{"name":"companyReview","type":"uint256"}],"payable":false,"type":"function"}]



//var peopleContractAddress = '0xe2c7e8440f5089011951cb6114c31522ba524638'
var peopleContractAddress = '0xc9a79464fffab1bd9f355a472b3e255f61a68cec'

var reviewContractAddress = '0x993374073fea30f0e354b15bcf95419bf4b84c6a'
// 0x993374073fea30f0e354b15bcf95419bf4b84c6a

var peopleContract = ETHEREUM_CLIENT.eth.contract(peopleContractABI).at(peopleContractAddress)
var reviewContract = ETHEREUM_CLIENT.eth.contract(reviewContractABI).at(reviewContractAddress)
ETHEREUM_CLIENT.eth.defaultAccount = ETHEREUM_CLIENT.eth.coinbase;


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
       list: ['unicycle', 'juggling clubs', 'stilts']
    }
  }

handleThumbsUp() {
  var companyName = document.getElementById("CompanyNameInput").value;
  document.getElementById("CompanyNameInput").value = "";
  var Reviewer = "Trevor";
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

}

handleThumbsDown() {
  var companyName = document.getElementById("CompanyNameInput").value;
  document.getElementById("CompanyNameInput").value = "";
  var Reviewer = "Trevor";
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

  //  reviewContract.addReview("company1", "trevor lee oakley", 1)

    this.setState({
      firstNames: String(data[0]).split(','),
      lastNames: String(data[1]).split(','),
      ages: String(data[2]).split(','),

      companyNames: String(reviewData[0]).split(','),
      companyReviewers: String(reviewData[1]).split(','),
      companyReviews: String(reviewData[2]).split(',')


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

    var CompanyReviews = []
    _.each(this.state.companyNames, (value, index) => {
      CompanyReviews.push(
        <tr>
        <td>{ETHEREUM_CLIENT.toAscii(this.state.companyNames[index])}</td>
        <td>{ETHEREUM_CLIENT.toAscii(this.state.companyReviewers[index])}</td>
        <td>{this.state.companyReviews[index]}</td>
        </tr>
      )
    })

    return (
      <div className="App">
        <div className="App-header">CompanyNameInput

          <h2>Zillerium Demo (Reviews on the blockchain)</h2>
          <ul>
          <li>Global access via contract address </li>
          <li>Private blockchain at IP address</li>
          <li>Decentralised database which is extendible to multi nodes</li>
          <li><a href="http://Zillerium.com"  ><font color="#ffffff">Zillerium.com</font></a></li>
          </ul>
        </div>
  <div  className="App-Content">

  <input
       type="text"
       id="CompanyNameInput"
       placeholder="Company Name"

       name="filtertext"
   />

           <button type="button" className="btn btn-link" onClick={() => this.handleThumbsUp()}><span className="glyphicon glyphicon-thumbs-up"></span></button>
           <button type="button" className="btn btn-link" onClick={() => this.handleThumbsDown()}><span className="glyphicon glyphicon-thumbs-down"></span></button>
            <button type="button" onClick={() => this.addItem()}>Add Comment</button>
<div>
<ul>
             {listItems}
           </ul>
           <ul>
                        {listItems2}
                      </ul>
</div>

        <p className="App-intro">
          This demo reads data from contract address 0x2fa234ca09983444ba79aee84ede9412c40d1526 at 104.236.58.158. This is a private blockchain.

        </p>

<table  >
<thead>
<tr>
<th>First Name</th>
<th>Last Name</th>
<th>Age</th>
</tr>
</thead>
<tbody>
{TableRows}
</tbody>
</table>

<table  >
<thead>
<tr>
<th>CompanyName</th>
<th>Review</th>
<th>Reviewer</th>
</tr>
</thead>
<tbody>
{CompanyReviews}
</tbody>
</table>

        </div>

      </div>
    );
  }
}

export default App;
