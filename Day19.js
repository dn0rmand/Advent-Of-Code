module.exports = function()
{
    var puzzleInput = 3017957;
    console.log("initializing...")
    var engine = new bucketEngine(puzzleInput);
    console.log("Calculating...")
    var winner = calculate(engine);
    console.log("Winning elf is " + winner);

    process.exit(0);

    function bucketEngine(elfCount) 
    {        
        this.elfCount = elfCount;

        var bucketSize  = 2500;
        var bucketCount = Math.floor((elfCount / bucketSize) + 1);         
        var buckets     = new Array(bucketCount);

        for(var i = 1, bucket = 0 ; i <= elfCount ; i += bucketSize)
        {
            var b = makeBucket(i);
            b.start = i-1;
            b.index = bucket;

            buckets[bucket++] = b;
        }

        function makeBucket(idx)
        {
            var elves = new Array(bucketSize);
            var count = 0;
            for(var i = 0; i < bucketSize; i++)
            {
                if (idx+i <= elfCount)
                {
                    count++;
                    elves[i] = idx+i;
                }
            }
            return { count: count, elves:elves, start:idx }; 
        }

        function getBucket(index)
        {
            var low = 0;
            var hi  = bucketCount-1;
            var mid = Math.round((hi + low)/2);
            var bucket = buckets[mid];

            while (index < bucket.start || index >= (bucket.start + bucket.count))
            {
                var oldMid = mid;

                if (index < bucket.start)
                {
                    hi = mid;
                    mid = Math.round((hi + low)/2);
                    if (mid == oldMid)
                        mid-=1;
                }
                else 
                {
                    low = mid;
                    mid = Math.round((hi + low)/2);
                    if (mid == oldMid)
                        mid+=1;
                }

                if (mid > hi || mid < low)
                    throw "Bucket not found!!!!";
                
                bucket = buckets[mid];
            }       

            return bucket;
//             var idx = 0;
//             for (var bck = 0; bck < buckets.length; bck++)
//             {
//                 var bucket = buckets[bck];
//                 if (index >= idx && index < idx + bucket.count)
//                 {
//   //                  bucket.start = idx;
//                     return bucket;
//                 }
//                 idx += bucket.count;
//             }
//             throw "Bucket not found!!!!";
        }

        this.splice = function(idx)
        {
            var bucket = getBucket(idx);
            idx -= bucket.start;
            bucket.count -= 1;
           for(var i = idx; i < bucket.count; i++)
               bucket.elves[i] = bucket.elves[i+1];

            for(var b1 = bucket, bi = bucket.index+1 ;  bi < bucketCount ; bi++)
            {
                var b2 = buckets[bi];
                b2.start = b1.start + b1.count;
                b1 = b2;
            }
        }

        this.getElf = function(idx)
        {
            var bucket = getBucket(idx);
            
            return bucket.elves[idx - bucket.start];            
        }
    }

    function calculate(engine)
    {
        function getNextElf(idx, count)
        {
            if (count > 2)
            {
                var middle = count >> 1;
                idx += middle;
            }
            else
                idx = idx+1;

            return idx % count;
        }
        
        var current = 0;
        var elfs    = engine.elfCount;

        while (elfs > 1) 
        {
            var next = getNextElf(current, elfs);
            if (next == current)
                throw "Impossible!";

            engine.splice(next);

            elfs--;

            if (next < current)
                current--;

            current += 1
            if (current >= elfs)
                current = 0;
        }

        var winner = engine.getElf(current);
        return winner;
    }
};
