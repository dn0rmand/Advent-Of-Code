module.exports = async function()
{
    const compiler = require('../tools/duet.js');

    async function create(pid, sndQueue, rcvQueue)
    {
        let vm = compiler.create(pid, sndQueue, rcvQueue);

        await vm.parse("Data/Day18.data");

        vm.compile();
        vm.$registers.p = pid;
        return vm;
    }

    async function solve1()
    {
        let queue = [];
        let vm = await create(0, queue, queue);

        let last = -1;

        vm.didSend = function(value) {
            last = value;
        };
        vm.didReceive = function(value)
        {
            vm.$current = vm.$instructions.length + 10; // Move out to stop program
        };

        vm.execute();
        console.log('Part 1: ' + last + ' (4601)');
    }    

    async function solve2()
    {
        let queue0 = [];
        let queue1 = [];

        let vms = [
            await create(0, queue0, queue1),
            await create(1, queue1, queue0)
        ];

        let counter = 0;

        vms[1].didSend = function(value)
        {
            counter++;
        };

        compiler.run(vms);

        console.log("Program 1 sent " + counter + " times (6858)");
    }

    await solve1();
    await solve2();

    process.exit(0);
}