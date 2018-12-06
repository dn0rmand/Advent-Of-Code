from collections import Counter

def loadData():
    with open('2018/data/day5.data', 'rt') as data:
        return data.readline().strip()

def shouldRemove(a, b):
    if a is None:
        return False

    return a != b and (a == b.upper() or a == b.lower())

def reducePolymer(polymer):
    modified = True

    while modified:
        result = []
        modified = False
        a = None
        for b in polymer:            
            if a is None:
                a = b
            elif shouldRemove(a, b):            
                a = None
                modified = True
            else:
                if len(result) > 0:
                    last = result[-1]  
                else:
                    last = None

                if shouldRemove(last, a):
                    result.pop()
                else:
                    result.append(a)
                a = b

        if not a is None:
            result.append(a)

        if modified:
            polymer = result

    return len(polymer)

def part1(polymer):
    answer = reducePolymer(polymer)     
    print("Answer part 1 is", answer)

def part2(polymer):
    letters = Counter(polymer.upper()).most_common()
    min = -1
    for letter, _ in letters:
        newPolymer = filter(lambda c: c.upper() != letter, polymer)
        count = reducePolymer(newPolymer)
        if min == -1 or min > count:
            min = count

    print("Answer part 2 is", min)

print("")
print("*******************************")
print("* Advent of Code 2018 - Day 5 *")
print("*******************************")
print("")

input = loadData()
part1(input)
part2(input)

print("")