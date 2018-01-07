const synacor = module.exports = function()
{
    const fs = require('fs');

    const vm = require('./vm.js')();
    const input = require('./input.js')();
    const output = require('./output.js')();
    
    require('./map.js')(input, output);
    require('./history.js')(input, output);

    vm.read  = input.read;
    vm.print = output.print;
    
    let inputStream = fs.createReadStream('Data/challenge.bin');

    inputStream
        .on('data', (chunk) => {
            vm.$memory.push(...chunk)
        })
        .on('end',  () => {  
            vm.execute();
        });
};

synacor(); // for debugging
