import math

map = {}

intersections = []

def makeKey(x, y):
    key = str(x) + ':' + str(y)
    return key

def addPoint(x, y, value, wire):
    key = makeKey(x, y)
    if map.get(key) != None:
        v , w = map.get(key)
        if w != wire:
            if x != 0 or y != 0:
                intersections.append((x, y))
            value += v
        else:
            value = min(v, value)

    map[key] = (value, wire)

def loadData():

    file = open('2019/data/day3.data', 'rt')

    for wire in range(1, 3):
        x, y, step  = 0, 0, 0

        for move in file.readline().split(','):
            value = int(move[1:])
            xx = 0
            yy = 0

            if move[0] == 'U':
                yy = -1
            elif move[0] == 'D':
                yy = 1
            elif move[0] == 'L':
                xx = -1
            elif move[0] == 'R':
                xx = 1
            else:
                raise Exception('Invalid move')

            for _ in range(0, value):
                step += 1
                y += yy
                x += xx
                addPoint(x, y, step, wire)

    file.close()

def part1():

    distance = None

    for x, y in intersections:
        dist = abs(x) + abs(y)
        if distance == None:
            distance = dist
        else:
            distance = min(dist, distance)

    return distance

def part2():
    steps = None

    for x, y in intersections:
        s, _ = map.get(makeKey(x, y))
        if steps == None:
            steps = s
        else:
            steps = min(s, steps)

    return steps

print("")
print("*******************************")
print("* Advent of Code 2019 - Day 3 *")
print("*******************************")
print("")

loadData()

print("Answer part 1 is", part1())
print("Answer part 2 is", part2())

print("")
