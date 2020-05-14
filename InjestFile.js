const readline = require('readline');
const fs = require('fs');
const DataBuilder = require('./DataBuilder')
const readInterface = readline.createInterface({
    input: fs.createReadStream('./Debug_Tester.txt'),
    output: process.stdout,
    console: false
});



let builder = new DataBuilder.DataBuilder();
readInterface.on('line', function(line) {
    builder.parseLine(line);
});
readInterface.on('close', function() {
    console.log(builder.getData());
});


