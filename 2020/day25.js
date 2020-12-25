const day25 = module.exports = function() 
{
    const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

    // const DOOR_PUBLIC_KEY = 17807724;
    // const CARD_PUBLIC_KEY = 5764801;

    const DOOR_PUBLIC_KEY = 17786549;
    const CARD_PUBLIC_KEY = 7573546;

    function getMinLoopSize(key1, key2)
    {
        let k = 1;
        let loop = 0;
        while (true) {
            loop++;
            k = (k * 7) % 20201227;
            if (k === key1) {
                return { loop, publicKey: key2 };
            } else if (k === key2) {
                return { loop, publicKey: key1 };
            }
        }
    }

    function part1()
    {
        const { loop, publicKey } = getMinLoopSize(DOOR_PUBLIC_KEY, CARD_PUBLIC_KEY);

        let handShake = 1;

        for(let i = 0; i < loop; i++)
            handShake = (handShake * publicKey) % 20201227;

        return handShake;
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1()}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);
};
