const synacor = module.exports = function()
{
    const fs = require('fs');

    const vm = require('./vm.js')();
    const map = require('./map.js')();

    vm.read = map.read;
    vm.print = map.print;
    
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
