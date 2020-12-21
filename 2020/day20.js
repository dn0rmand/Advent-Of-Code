const day20 = module.exports = function() 
{
    const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

    const IMAGE_SIZE = 10;

    const SEA_MONSTER = [
        '                  # ',
        '#    ##    ##    ###',
        ' #  #  #  #  #  #   ',
    ];
    const SEA_MONTER_SIZE = 15;

    const SEA_MONSTER_WIDTH = SEA_MONSTER[0].length;
    const SEA_MONSTER_HEIGHT= SEA_MONSTER.length;

    const $mirrors = [];
    function getMirror(value)
    {
        if ($mirrors[value])
            return $mirrors[value];

        let mirror = 0;
        for(let v = value, size = IMAGE_SIZE; size; size--)
        {
            mirror *= 2;
            if (v & 1) {
                mirror += 1;
                v -= 1;
            }
            v /= 2;
        }

        $mirrors[value] = mirror;

        return mirror;
    }

    class Image
    {
        constructor(id)
        {
            this.id   = id;
            this.data = [];
            this.possibleMatches = [];
            this.states = [];
            this.imageSize = IMAGE_SIZE
        }

        addRow(row)
        {
            if (! row)
                throw "Invalid data";

            if (row.length !== this.imageSize) {
                throw "Invalid row length";
            } else {
                this.data.push(row);
            }
        }

        analyze()
        {
            if (this.data.length !== this.imageSize) {
                throw 'Image not square';
            }

            this.top = 0;
            this.right = 0;
            this.bottom = 0;
            this.left = 0;

            for(let i = 0; i < this.imageSize; i++) {
                this.top   = (this.top   * 2) + (this.data[0][i] === '#' ? 1 : 0);
                this.right = (this.right * 2) + (this.data[i][this.imageSize-1] === '#');
                this.bottom= (this.bottom* 2) + (this.data[this.imageSize-1][this.imageSize-1-i] === '#');
                this.left  = (this.left  * 2) + (this.data[this.imageSize-1-i][0] === '#');
            }
        }

        isPossibleMatch(image)
        {
            const canValueMatch = value => (
                value === image.top || 
                value === image.right || 
                value === image.bottom || 
                value === image.left);

            if (canValueMatch(getMirror(this.top)))
                return true;
            if (canValueMatch(getMirror(this.right)))
                return true;
            if (canValueMatch(getMirror(this.bottom)))
                return true;
            if (canValueMatch(getMirror(this.left)))
                return true;

            if (canValueMatch(this.top))
                return true;
            if (canValueMatch(this.right))
                return true;
            if (canValueMatch(this.bottom))
                return true;
            if (canValueMatch(this.left))
                return true;

            return false;
        }

        dump()
        {
            this.data.forEach(r => console.log(r));
            console.log('\n');
        }

        matchLeft(image)
        {
            for(let y = 0; y < this.imageSize; y++)
            {
                if (this.data[y][0] !== image.data[y][this.imageSize-1])
                    return false;
            }
            return true;
        }

        matchTop(image)
        {
            for(let x = 0; x < this.imageSize; x++)
            {
                if (this.data[0][x] !== image.data[this.imageSize-1][x])
                    return false;
            }
            return true;
        }

        flipVertical(oldData)
        {
            const data = Array(this.imageSize); 
            for(let y1 = 0, y2 = this.imageSize-1; y1 < y2; y1++, y2--)
            {
                data[y1] = oldData[y2];
                data[y2] = oldData[y1];
            }
            return data;
        }

        flipHorizontal(oldData)
        {
            const data = Array(this.imageSize);
            for(let y = 0; y < this.imageSize; y++)
            {
                data[y] = oldData[y].split('').reverse().join('');
            }
            return data;
        }

        rotate(oldData)
        {
            const data = Array(this.imageSize);
            for(let x = 0; x < this.imageSize; x++) 
            {
                const row = Array(this.imageSize);
                for(let y = this.imageSize; y; y--) 
                {
                    row[this.imageSize-y] = oldData[y-1][x];
                }
                data[x] = row.join('');
            }

            return data;
        }

        next()
        {
            this.state = (this.state+1) % this.states.length;
            this.data  = this.states[this.state];
        }

        buildStates()
        {            
            const makeKey = data => data.reduce((a, v) => a+v, '');
            const visited = new Set();

            const self = this;

            const add = data => {
                const key = makeKey(data);
                if (! visited.has(key)) {
                    visited.add(key);
                    self.states.push(data);
                }
                return data;
            };

            let current = this.data;

            for(let i = 0; i < 4; i++) 
            {
                const next = add(current);
                
                add(this.flipHorizontal(current));
                add(this.flipVertical(current));

                current = this.rotate(current);
            }

            this.state = 0;
            this.data  = this.states[0];
        }
    }

    function loadData()
    {
        const readFile = require("advent_tools/readfile");

        const images = [];
        let currentImage = undefined;

        for(const line of readFile(__filename))
        {
            if (line.length === 0) {
                if (currentImage)
                {
                    images.push(currentImage);
                    currentImage = undefined;
                }
            } else if (line.startsWith('Tile ')) {
                const id = line.substring(5, line.length-1);
                currentImage = new Image(+id);
            } else {
                if (! currentImage)
                    throw "ERROR";
                currentImage.addRow(line);
            }
        }
        if (currentImage)
            images.push(currentImage);

        return images;
    }

    function prepare(images)
    {
        images.forEach(image => image.analyze());

        for(let i = 0; i < images.length; i++)
        {
            const image1 = images[i];
            for(let j = i+1; j < images.length; j++) {
                const image2 = images[j];

                if (image1.isPossibleMatch(image2)) {
                    image1.possibleMatches.push(image2);
                    image2.possibleMatches.push(image1);
                }
            } 
        }

        images.sort((a, b) => a.possibleMatches.length - b.possibleMatches.length);

        if (images[0].possibleMatches.length < 2)
            throw "NOT SOLVABLE";

        return images;
    }

    function part1(images)
    {
        images = prepare(images);

        const corners = images.filter(img => img.possibleMatches.length === 2);
        if (corners.length === 4) {
            return corners.reduce((a, i) => a * i.id, 1);
        }
        return 0;
    }

    function generateImage(images)
    {
        // const images = prepare();

        images.forEach(image => image.buildStates());

        const SIZE = Math.sqrt(images.length);
        if (SIZE !== Math.floor(SIZE))
            throw "Invalid number of images";

        const fullImage = Array(SIZE).fill(0).map(r => Array(SIZE));

        const used = [];

        // Fill diagonaly

        const positions = (function() {
            const pos = [];
            for(let Y = 0; Y < SIZE; Y++)
            {
                for(let y = Y, x = 0; y >= 0 && x < SIZE; x++, y--) {
                    pos.push({x, y});
                }
            }
            for(let X = 1; X < SIZE; X++) {
                for(let y = SIZE-1, x = X; y >= 0 && x < SIZE; x++, y--) {
                    pos.push({x, y});
                }
            }
            if (pos.length != SIZE*SIZE)
                throw "ERROR";
            return pos;
        })();

        //

        function search(pos, possibleMatches) 
        {
            if (pos >= positions.length)
                return true;

            const { x, y } = positions[pos];

            possibleMatches = possibleMatches.filter(img => !used[img.id]);
            let left, top;

            if (x > 0) {
                left = fullImage[y][x-1];
                possibleMatches = possibleMatches.filter(img1 => left.possibleMatches.some(img2 => img1.id === img2.id));
            }
            if (y > 0) {
                top = fullImage[y-1][x];
                possibleMatches = possibleMatches.filter(img1 => top.possibleMatches.some(img2 => img1.id === img2.id));
            }

            for(const image of possibleMatches) 
            {
                for(let i = 0; i < image.states.length; i++) 
                {
                    if ((!left || image.matchLeft(left)) && (!top || image.matchTop(top))) 
                    {
                        used[image.id] = true;
                        fullImage[y][x] = image;
                        if (search(pos+1, images))
                        {
                            return true;
                        }
                        fullImage[y][x] = undefined;
                        used[image.id] = false;
                    }
                    image.next();
                }
            }

            return false;
        }

        const corners = images.filter(img => img.possibleMatches.length === 2);

        if (! search(0, corners)) 
            throw "Can't do it :(";

        // Now generate the big image

        const PICTURE_SIZE = SIZE*(IMAGE_SIZE-2)
        const picture = Array(PICTURE_SIZE).fill(0).map(r => Array(PICTURE_SIZE).fill('.'));

        for(let y = 0, yp = 0; y < SIZE; y++, yp += IMAGE_SIZE-2) {
            for(let x = 0, xp = 0; x < SIZE; x++, xp += IMAGE_SIZE-2) {
                const image = fullImage[y][x];

                for(let y = 0; y < IMAGE_SIZE-2; y++)
                for(let x = 0; x < IMAGE_SIZE-2; x++)
                    picture[yp+y][xp+x] = image.data[y+1][x+1];
            }
        }

        return picture.map(r => r.join(''));
    }

    function countSeaMonster(picture)
    {
        function matches(x, y)
        {
            for(let ox = 0; ox < SEA_MONSTER_WIDTH; ox++)
            for(let oy = 0; oy < SEA_MONSTER_HEIGHT; oy++)
            {
                if (SEA_MONSTER[oy][ox] === ' ') 
                    continue; // ignore spaces
                if (picture.data[y+oy][x+ox] !== '#') 
                    return false;
            }

            return true;
        }

        let total = 0;

        for(let x = 0; x+SEA_MONSTER_WIDTH < picture.imageSize; x++)
        {
            for(let y = 0; y+SEA_MONSTER_HEIGHT < picture.imageSize; y++)
            {
                if (matches(x, y))
                {
                    total++;
                }
            }
        }

        return total;
    }

    function part2(images)
    {
        const picture = new Image(0);
        
        picture.data = generateImage(images);
        picture.imageSize = picture.data.length;
        picture.buildStates();

        let total = 0;
        for(let i = 0; i < picture.states.length; i++)
        {
            total = countSeaMonster(picture);
            if (total)
                break;

            picture.next();
        }

        const roughness = picture.data.reduce((a, r) => {
            for(const c of r) {
                if (c === '#') {
                    a++;
                }
            }
            return a;
        }, 0);

        const answer = roughness - total*SEA_MONTER_SIZE;
        return answer;
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-loading`);
    const input = loadData();
    console.timeLog(`${DAY}-loading`, `to load the input of day ${DAY}`);

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1(input)}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2(input)}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
};
