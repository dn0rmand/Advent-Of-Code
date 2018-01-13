const synacor = module.exports = function()
{
    const fs = require('fs');
    const disassembler = require('./disassembler.js')();
    const vm = require('./vm.js')();

    const input = require('./input.js')();
    const output = require('./output.js')();

    require('./map.js')(input, output, vm);
    require('./coins.js')(input, output);
    //require('./history.js')(input, output);

    vm.read  = input.read;
    vm.print = output.print;
    
    let $didRead = input.didRead;
    input.didRead = function(input) {
        $didRead(input);
        if (input === 'max')
            console.log('Max Address = ' + vm.$maxAddress);
        else if (input === 'dis')
        {
            disassembler.$memory = vm.$memory;
            disassembler.$current = 0x17b6;// >> 1;

            while (disassembler.$current <= vm.$maxAddress*2)
            {
                var x = disassembler.execute();
                if (x !== '')
                {
                    process.stderr.write(x)
                    process.stderr.write('\n');
                }
            }
            process.exit(0);
        }
    }

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
