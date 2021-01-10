module.exports = function() 
{
    const input = '3113322113';

    function *lookAndSay(data)
    {
        let previous;
        let count = 0;

        for(const c of data)
        {
            if (c == previous)
            {
                count++;
            }
            else if (count > 0)
            {
                for (const cc of count.toString())
                    yield cc;

                yield previous;
                previous = c;
                count = 1;
            }
            else
            {
                previous = c;
                count    = 1;
            }
        }

        if (count > 0)
        {
            for (const cc of count.toString())
                yield cc;
            yield previous;
        }
    }

    function execute(times)
    {
        data = input;
        for(let i = 0; i < times; i++)
        {
            data = lookAndSay(data);
        }
    
        let count = 0;
        for(const _ of data)
            count++;

        console.log(`After ${times} times, length is ${count}`);
    }

    execute(40);
    execute(50);
    process.exit(0);
}
