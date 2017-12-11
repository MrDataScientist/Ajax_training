/* global web3:true */

import contract from 'truffle-contract'

// import artifacts
import saleArtifacts from '../../../build/contracts/Sale.json'

// create contracts
const Sale = contract(saleArtifacts)
Sale.setProvider(web3.currentProvider)

export {
  Sale
}
