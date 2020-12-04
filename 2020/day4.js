function loadData()
{
    const readFile = require("advent_tools/readfile");

    const passports = [];
    let passport = undefined;

    for(const line of readFile(__filename))
    {
        if (line === '') {
            if (passport !== undefined) {
                passports.push(passport);
                passport = undefined;
            }
        } else {
            if (passport === undefined) {
                passport = {};
            }

            for (const entry of line.split(' '))
            {
                const values = entry.trim().split(':');
                if (values.length !== 2) {
                    throw "Invalid data";
                }
                passport[values[0].trim()] = values[1].trim();
            }
        }
    }

    if (passport !== undefined) {
        passports.push(passport);
    }

    return passports;
}

function part1()
{
    const passports = loadData();

    const passportValidation = {
        // (Birth Year)
        'byr': value => value !== undefined,
        // (Issue Year)
        'iyr': value => value !== undefined,
        // (Expiration Year)
        'eyr': value => value !== undefined,
        // (Height)
        'hgt': value => value !== undefined,
        // (Hair Color)
        'hcl': value => value !== undefined,
        // (Eye Color)
        'ecl': value => value !== undefined,
        // (Passport ID)
        'pid': value => value !== undefined,
        // (Country ID)
        'cid': _ => true,
    };

    const answer = passports.reduce((validCount, passport) => {
        for(const field of Object.keys(passportValidation)) {
            if (! passportValidation[field](passport[field])) {
                return validCount;
            }
        }
        return validCount+1;
    }, 0);

    return answer;
}

function part2()
{
    const passports = loadData();

    const passportValidation = {
        // (Birth Year) - four digits; at least 1920 and at most 2002
        'byr': value => value !== undefined && +value >= 1920 && +value <= 2002,

        // (Issue Year) - four digits; at least 2010 and at most 2020.
        'iyr': value => value !== undefined && +value >= 2010 && +value <= 2020,

        // (Expiration Year) - four digits; at least 2020 and at most 2030
        'eyr': value => value !== undefined && +value >= 2020 && +value <= 2030,

        // (Height) - a number followed by either cm or in
        //     If cm, the number must be at least 150 and at most 193.
        //     If in, the number must be at least 59 and at most 76.
        'hgt': value => value !== undefined && (
                            value.match(/^1(([5-8]\d)|(9[0-3]))cm$/) ||
                            value.match(/^((59)|(6\d)|(7[0-6]))in$/)
                        ),

        // (Hair Color) - a # followed by exactly six characters 0-9 or a-f
        'hcl': value => value !== undefined && value.match(/^#[0123456789abcdef]{6}$/),

        // (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
        'ecl': value => value !== undefined && value.match(/^(amb)|(blu)|(brn)|(gry)|(grn)|(hzl)|(oth)$/),

        // (Passport ID) - a nine-digit number, including leading zeroes.
        'pid': value => value !== undefined && value.match(/^\d{9}$/),

        // (Country ID)
        'cid': value => true,
    };

    const answer = passports.reduce((validCount, passport) => {
        for(const field of Object.keys(passportValidation)) {
            if (! passportValidation[field](passport[field])) {
                return validCount;
            }
        }
        return validCount+1;
    }, 0);

    return answer;
}

console.log('--- Advent of Code day 4 ---');
console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
