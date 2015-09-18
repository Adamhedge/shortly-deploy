var app = require('./server-config.js');

var port = process.env.PORT || 4568;
console.log(process.env);

app.listen(port, function(){
  console.log("host info might be:", this.address());
});

console.log('Server now listening on port ' + port);

// dummy commit testing the things.