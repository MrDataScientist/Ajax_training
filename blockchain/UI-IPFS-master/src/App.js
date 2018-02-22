
import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3'
import _ from 'lodash'
import {Navbar, Jumbotron, Button} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import IpfsAPI from 'ipfs-api'


var axios = require('axios')


class App extends Component {

  constructor(props) {
    super(props);
    var zIpfsAPI = IpfsAPI('127.0.0.1', '', {protocol: 'http', port: '5001', progress: 'false'})
    this.state = {val: 0, increasing: false, contractJson:[], products:[],IPFSContract:'', IPFSText: '--',
      ETHEREUM_CLIENT: 'a', UserMessage: [], contractAddress: '0x8d3e374e9dfcf7062fe8fc5bd5476b939a99b3ed',
      zIpfsAPIParm: zIpfsAPI}

    this.reformatArray = this.reformatArray.bind(this)
    this.reformatArrayEnd = this.reformatArrayEnd.bind(this)
    this.addIPFSContent = this.addIPFSContent.bind(this)

  }

  setClient = ( ) => {
    console.log("props", this)
  //  this.setState({ ETHEREUM_CLIENT: info });
  }



addIPFSContent(e) {
  let inputStr = this.refs.b.value;
  var s = new Buffer(inputStr);
  var _this = this;
  _this.state.zIpfsAPIParm.add(s, function (err, res){
          console.log("hello");
          if(err || !res) return console.error("ipfs add error", err, res);
          else{
//                console.log("no issue"ipfsAdd);
//                console.log(res);
            res.forEach(function(text) {
                   console.log('successfully stored', text.hash);
                 //  console.log('successfully stored', text.path);
                 //  display(file.Hash);
                    var textaddress=text.hash;
                    console.log(textaddress);
                    var IPFS1 = textaddress.substring(0,32);
                    var IPFS2 = textaddress.substring(32,textaddress.length);
                    _this.state.IPFSContract.addIpfs(IPFS1, IPFS2);
            });
          }
        });

}

componentWillMount() {
  console.log('componentWillMount');
  let localJsonABI = [ { "constant": true, "inputs": [], "name": "getIpfsData", "outputs": [ { "name": "", "type": "bytes32[]" }, { "name": "", "type": "bytes32[]" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_addr1", "type": "bytes32" }, { "name": "_addr2", "type": "bytes32" } ], "name": "addIpfs", "outputs": [ { "name": "success", "type": "bool" } ], "payable": true, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "ipfsrecs", "outputs": [ { "name": "addr1", "type": "bytes32" }, { "name": "addr2", "type": "bytes32" } ], "payable": false, "type": "function" } ]
  this.setState({contractJson: localJsonABI})
  let w = new Web3(new Web3.providers.HttpProvider("http://104.236.58.158:8545"))
  this.setState({ETHEREUM_CLIENT: w});
//  this.setClient = this.setClient.bind(this);


  let IPFSContractLocal = w.eth.contract(localJsonABI).at(this.state.contractAddress)
  this.setState({IPFSContract: IPFSContractLocal})

w.eth.defaultAccount = w.eth.coinbase;
//  this.state.ETHEREUM_CLIENT.eth.defaultAccount = this.state.ETHEREUM_CLIENT.eth.coinbase;
  let ipfsBCData = IPFSContractLocal.getIpfsData();
  var ipfs1 = String(ipfsBCData[0]).split(',')
  var ipfs2 = String(ipfsBCData[1]).split(',')
  var ipfsAddressLocalArray = [];
  for (var i = 0; i < ipfs1.length; i++) {
      var aIPDFDataRecHex = ipfs1[i]
      var addr1 = this.reformatArray(aIPDFDataRecHex)
      aIPDFDataRecHex = ipfs2[i]
      var addr2 = this.reformatArrayEnd(aIPDFDataRecHex)
      ipfsAddressLocalArray[i] = addr1+addr2;
  }
       var _this = this;
       let reviewArray =[];
       let reviewAddr = [];
       let reviewText=[];
       let j=-1;
       for (var i = 0; i < ipfsAddressLocalArray.length; i++) {

            let fulladdr = ipfsAddressLocalArray[i];
            console.log('ipfs address ', fulladdr)
             let url = "http://ipfs.io/api/v0/cat?arg="+fulladdr;
             console.log("url ", url)
             axios
             .get(url)
             .then(function(result) {
                 j++;
               console.log('file ', result.data)
               reviewArray.push(j);
               reviewAddr.push(fulladdr);
               reviewText.push(result.data);
               _this.setState({
                               products:  _this.state.products.concat({
                               'reviewIndex': j,
                                 'ipfsAddr': fulladdr,
                              'ipfsText': result.data
                            })
                        })

               })

               .catch(function (error) {
                   console.log(error);
               });

       }
}

reformatArray(strVal) {
  strVal = strVal.replace('0x', '');
  strVal = strVal.replace('00', '');
  var hex = strVal.toString();
  var aIPDFDataRec = '';
  for (var n = 0; n < hex.length; n += 2) {
      aIPDFDataRec += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return aIPDFDataRec;
}

reformatArrayEnd(strVal) {
  strVal = strVal.replace('0x', '');
  strVal = strVal.replace(/00/g, '');
  var hex = strVal.toString();
  var aIPDFDataRec = '';
  for (var n = 0; n < hex.length; n += 2) {
      aIPDFDataRec += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return aIPDFDataRec;
}

addAddress() {
  var IPFSAddress = document.getElementById("NewIPFSAddress").value;
  document.getElementById("NewIPFSAddress").value = "";
  var IPFS1 = "";
  var IPFS2 = "";
  var err = 0;
  if (IPFSAddress.length>31) {
    if (IPFSAddress.length>63) {
      var aMessage = this.state.UserMessage.slice();
      aMessage.push('Error - string too long - max is 32 chars')
      this.setState({UserMessage:aMessage});
      var err =1;
    } else {
      IPFS1 = IPFSAddress.substring(0,32);
      IPFS2 = IPFSAddress.substring(32,IPFSAddress.length);
    }
  } else {
    IPFS2 = "";
  }
  if (err==0) {
    this.state.IPFSContract.addIpfs(IPFS1, IPFS2);
    var aMessage = this.state.UserMessage.slice();
    aMessage.push('Your IPFS ADDRESS will be added in a few minutes to the blockchain - please refresh then')
    this.setState({UserMessage:aMessage});
}



  //reviewContract.addReview("company12", "trevor lee oakley", 1)
}


render() {

  var ShowMessage = [];
  this.state.UserMessage.forEach((item, i) => {
         ShowMessage.push(<p className = "jenbil-warn">{item}</p>);
     });

    return (
        <div>
            <p className="App-intro">
                Demo - read the blockchain and display text contents from IPFS
            </p>
            <input
                 type="text"
                 id="NewIPFSAddress"
                 placeholder="New Address"
                 name="NewAddressName"
             />
            <button type="button" className="btn btn-link" onClick={() => this.addAddress()}>Add IPFS Address</button>
            <input
                 type="text"
                 id="NewIPFSContent"
                 ref="b"
                 placeholder="New Content"

                 name="NewIPFSContentName"
             />{this.state.IPFSText}

              <button type="button" className="btn btn-link" onClick={() => this.addIPFSContent()}>Add IPFS Content</button>
           {ShowMessage}

            <BootstrapTable data={this.state.products} striped={true} hover={true}>
                <TableHeaderColumn dataField="reviewIndex" isKey={true} dataAlign="center" dataSort={true}>Review
                    ID</TableHeaderColumn>
                <TableHeaderColumn dataField="ipfsAddr" dataAlign="center" dataSort={true}>Ipfs
                    Address</TableHeaderColumn>
                <TableHeaderColumn dataField="ipfsText" dataAlign="center" dataSort={true}>Ipfs
                    Text</TableHeaderColumn>

            </BootstrapTable>
        </div>
    );
}
}




export default App;
