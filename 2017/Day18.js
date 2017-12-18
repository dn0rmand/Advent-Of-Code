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

        vm.didReceive = function(value)
        {
            if (queue.length > 0)
                value = queue.pop(); // We want the last value not the first one!!!!
            console.log('Part 1: ' + value + ' (4601)');
            vm.$current = 10000; // Move out to stop program
        };

        vm.execute();
    }    

    async function solve2()
    {
        let queue0 = [];
        let queue1 = [];

        let vms = [
            await create(0, queue0, queue1),
            await create(1, queue1, queue0)
        ];

        compiler.run(vms);

        console.log("Program 1 sent " + vms[1].sent + " times (6858)");
    }

    await solve1();
    await solve2();

    process.exit(0);
}