export default {
  contractAddress: '0xfffdb0207f31fee82fb63359c52dd6ff7633380d',
  contractAbi: [{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":true,"inputs":[{"name":"_owner","type":"address"}],
  "name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],
  "payable":false,"stateMutability":"view","type":"function"},
  {"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
  {"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},
  {"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
}
