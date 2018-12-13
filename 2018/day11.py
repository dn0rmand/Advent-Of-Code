# from collections import Counter
# from collections import deque
# from collections import defaultdict
from time import time

KEY = 2568

def getLevel(x, y):    
    level = x*x*y + 20*x*y + KEY*x + 100*y + KEY*10 
    level = level % 1000
    level = (level - (level % 100)) / 100
    return int(level - 5)

def buildMap(size):
    world = [[]]    
    for y in range(1, size+1):
        row = [0]
        world.append(row)
        for x in range(1, size+1):
            row.append(getLevel(x, y))

    return world        

def getSquare(world, size, x, y):
    value = 0
    for row in world[y:y+size]:
        value += sum(row[x:x+size])
    return value

def solve(world, size):
    maxLevel, minX, minY = getSquare(world, size, 1, 1), 1, 1
    m = 301-size
    for y in range(1,m):
        for x in range(1, m):
            level = getSquare(world, size, x, y)
            if level > maxLevel:
                maxLevel, minX, minY = level, x, y

    return maxLevel, minX, minY

def part1():
    world = buildMap(300)

    level, x, y = solve(world, 3)
    print("Answer part 1 is",  str(x) + ',' +  str(y), "- Power level of", level)

def part2():    
    world = buildMap(300)
    size = 1
    level, x, y = solve(world, 1)

    for sz in range(2, 300):
        l, xx, yy = solve(world, sz)
        if l > level:
            level, x, y, size = l, xx, yy, sz
    print("Answer part 2 is", str(x) + "," + str(y) + "," + str(size), "- Power level of", level)

print("")
print("********************************")
print("* Advent of Code 2018 - Day 11 *")
print("********************************")
print("")

start = time()
part1()
end = time()
print(end-start)

start = time()
part2()
end = time()
print(end-start)

print("")