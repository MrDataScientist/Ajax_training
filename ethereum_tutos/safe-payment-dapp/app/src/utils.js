/* global web3:true */

export function getBalance (address) {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(address, (err, balance) => {
      if (err) {
        reject(err)
        return
      }

      resolve(balance)
    })
  })
}

export function toEth (bigNumWei) {
  return web3.fromWei(bigNumWei)
}

export function isZero (address) {
  return address === '0x0000000000000000000000000000000000000000'
}

export function toDate (bigNumEpoch) {
  return (new Date(parseInt(bigNumEpoch) * 1000))
}
