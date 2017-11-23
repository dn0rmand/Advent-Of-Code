module.exports = function()
{
    /*
    Disc #1 has 17 positions; at time=0, it is at position 1.
    Disc #2 has 7 positions; at time=0, it is at position 0.
    Disc #3 has 19 positions; at time=0, it is at position 2.
    Disc #4 has 5 positions; at time=0, it is at position 0.
    Disc #5 has 3 positions; at time=0, it is at position 0.
    Disc #6 has 13 positions; at time=0, it is at position 5.
    */

    var discs = [
        { id:1, position: 1, slots: 17, first: 15 },
        { id:2, position: 0, slots:  7, first:  5 },
        { id:3, position: 2, slots: 19, first: 14 },
        { id:4, position: 0, slots:  5, first:  1 },
        { id:5, position: 0, slots:  3, first:  1 },
        { id:6, position: 5, slots: 13, first:  2 },
        { id:7, position: 0, slots: 11, first:  0 }
    ];

    var _discs = [
        { id:1, position: 4, slots: 5, first: 0 },
        { id:2, position: 1, slots: 2, first: 0 }
    ];

    function isDiscGood(disc, time)
    {
        var pos = (disc.position + time + disc.id) % disc.slots;

        if (pos == 0)
        {
            // if (disc.first < 0)
            // {
            //     disc.first = time;
            //     console.log("First good time for disc " + disc.id + " is " + time);
            // }
            return true;
        }
        else
            return false;
    }

    function isGood(time)
    {
        var ok = true;
        for(var i = 0; i < discs.length; i++)
            if (! isDiscGood(discs[i], time))
                return false; //ok = false;

        return ok;
    }

    var time = 0; // That's the first good time for disc 1
    var step = 1;

    // for(var i = 0; i < discs.length; i++)
    // {
    //     time = Math.max(time, discs[i].first);
    //     step = Math.max(step, discs[i].slots);
    // }

    while (! isGood(time))
    {
        time += step;

        // var x = time % 5000;
        // if (x == 0)
        // {
        //     process.stdout.write('\r' + time);
        // }
    }

    console.log("First good Time = " + time);

    process.exit(0);
}