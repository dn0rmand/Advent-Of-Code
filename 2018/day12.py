from collections import deque
from time import time

def addTransform(transforms, line):
    values = line.strip().split(' => ')
    key = values[0]
    value = values[1]
    key = (key[0], key[1], key[2], key[3], key[4])
    transforms[key] = value
    
def loadExample():
    transforms = {}
    data = "#..#.#..##......###...###"
    addTransform(transforms, "...## => #")
    addTransform(transforms, "..#.. => #")
    addTransform(transforms, ".#... => #")
    addTransform(transforms, ".#.#. => #")
    addTransform(transforms, ".#.## => #")
    addTransform(transforms, ".##.. => #")
    addTransform(transforms, ".#### => #")
    addTransform(transforms, "#.#.# => #")
    addTransform(transforms, "#.### => #")
    addTransform(transforms, "##.#. => #")
    addTransform(transforms, "##.## => #")
    addTransform(transforms, "###.. => #")
    addTransform(transforms, "###.# => #")
    addTransform(transforms, "####. => #")
    return data, transforms

def loadData():
    transforms = {}

    with open('2018/data/day12.data', 'rt') as inputFile:
        data = inputFile.readline().split()[2]
        inputFile.readline()
        for line in inputFile.readlines():
            values = line.strip().split(' => ')
            key = values[0]
            value = values[1]
            key = (key[0], key[1], key[2], key[3], key[4])
            transforms[key] = value

    return data, transforms

def getChar(data, index):
    if index < 0 or index >= len(data):
        return '.'
    return data[index]

def getTransformed(data, transforms, index):
    key = (getChar(data, index-2), getChar(data, index-1), getChar(data, index), getChar(data, index+1), getChar(data, index+2))
    if key in transforms:
        v = transforms[key]
        return v
    else:
        return '.'

def solve(data, transforms, iterations):
    first = 0

    for iteration in range(0, iterations):
        output = deque(( getTransformed(data, transforms, i) for i in range(-4, len(data)+4) ))
        first -= 4

        # remove . at the beginning
        while output[0] == '.':
            first +=1
            output.popleft()
        
        # remove . at the end
        while len(output) > 0 and output[len(output)-1] == '.':
            output.pop()

        output = ''.join(output)
        if output == data:
            first += iterations-iteration-1
            break

        data = output

    total = sum((i+first for i in range(0, len(data)) if data[i] == '#'))

    return total

def part1(data, transforms):
    answer = solve(data, transforms, 20)
    print("Answer to part 1 is", answer)

def part2(data, transforms):
    answer = solve(data, transforms, 50000000000)
    print("Answer to part 2 is", answer)

print("")
print("********************************")
print("* Advent of Code 2018 - Day 11 *")
print("********************************")
print("")

data, transforms = loadData() # loadExample() #

start = time()
part1(data, transforms)
part2(data, transforms)
end = time()
print("Executed in ", round((end-start)*1000), "ms")