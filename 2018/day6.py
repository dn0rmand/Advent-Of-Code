from parse import parse
from collections import defaultdict
from itertools import product

def loadPoints():
    points = [parse("{:d}, {:d}", line.strip()) for line in open('2018/data/day6.data', 'rt') if line]
    id = 0
    points = [(points[i][0], points[i][1], i+1) for i in range(0, len(points))]
    SIZE = 0

    for point in points:
        SIZE = max(SIZE, point[0], point[1])
    SIZE += 1
    return (points, SIZE)

def getDistance(x, y, point2):
    return abs(x-point2[0]) + abs(y-point2[1])

def part1(points, SIZE):
    infinite = set()
    counts = defaultdict(int)
    size = SIZE-1

    for x, y in product(range(0, SIZE), range(0, SIZE)):
        distances = sorted([(getDistance(x, y, point), point[2]) for point in points])
        distances = [v[1] for v in distances if v[0] == distances[0][0]]
        if len(distances) == 1:                
            if x == 0 or x == size or y == 0 or y == size:
                infinite.add(distances[0])
            else:
                counts[distances[0]] += 1

    answer = max([counts[i] for i in range(0, SIZE) if not i in infinite])

    print("Answer part 1 is", answer)

def part2(points, SIZE):
    count = 0
    
    for x, y in product(range(0, SIZE), range(0, SIZE)):
        distance = sum((getDistance(x, y, point) for point in points))
        if distance < 10000:
            count += 1

    print("Answer part 2 is", count)

print("")
print("*******************************")
print("* Advent of Code 2018 - Day 6 *")
print("*******************************")
print("")

point, SIZE = loadPoints()

part1(point, SIZE)
part2(point, SIZE)