var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'cloudeo'
});

connection.connect();

connection.query('SELECT *', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0]);
});

connection.end();
