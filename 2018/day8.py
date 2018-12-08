def loadData(input):
    data = [int(v) for v in input.strip().split(' ')]
    data.reverse()
    return data

def readNode1(input):
    nodes = input.pop()
    metadatas = input.pop()

    total = 0
    for _ in range(0, nodes):
        total += readNode1(input)

    for _ in range(0, metadatas):
        total += input.pop()

    return total

def part1(input):
    input = input.copy()
    total = 0
    while input:
        total += readNode1(input)

    print("Answer part 1 is", total)

def readNode2(input):
    nodes = input.pop()
    metadatas = input.pop()

    total = 0
    if nodes > 0:
        nodes = [readNode2(input) for _ in range(0, nodes)]        

        for _ in range(0, metadatas):
            m = input.pop()
            if m > 0 and m <= len(nodes):
                total += nodes[m-1]
    else:
        for _ in range(0, metadatas):
            total += input.pop()

    return total

def part2(input):
    input = input.copy()
    total = 0
    while input:
        total += readNode2(input)
    print("Answer part 2 is", total)

print("")
print("*******************************")
print("* Advent of Code 2018 - Day 7 *")
print("*******************************")
print("")

print("Test input")
input = loadData("2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2")
part1(input)
part2(input)

print("Real input")
input = loadData(open('2018/data/day8.data', 'rt').readline())
part1(input)
part2(input)
