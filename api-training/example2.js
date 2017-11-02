var http = require('http');
var fs = require('fs');

//readable stream
var myReadStream = fs.createReadStream(__dirname + '/example2.txt');

myReadStream.on('data', function(chunk){
  console.log('new chunk received:');
  console.log(chunk);
});
