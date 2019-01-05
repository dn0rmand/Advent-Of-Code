from time import time
import numpy as np

X = 0
Y = 1
Z = 2
RADIUS = 3

formulaProcessed = set()
resolveTime = [0]

class Formula:
    def create(a, b, c, r):
        # |a-x| + |b-y| + |c-z| = r

        # 1: (a-x) + (b-y) + (c-z) = r 
        yield Formula(-1, -1, -1, a+b+c-r)
        # 2: (a-x) + (b-y) - (c-z) = r 
        yield Formula(-1, -1, 1, a+b-c-r)
        # 3: (a-x) - (b-y) + (c-z) = r
        yield Formula(-1, 1, -1, a-b+c-r)
        # 3: (a-x) - (b-y) - (c-z) = r 
        yield Formula(-1, 1, 1, a-b-c-r)
        # 1: -(a-x) + (b-y) + (c-z) = r 
        yield Formula(1, -1, -1, -a+b+c-r)
        # 2: -(a-x) + (b-y) - (c-z) = r 
        yield Formula(1, -1, 1, -a+b-c-r)
        # 3: -(a-x) - (b-y) + (c-z) = r 
        yield Formula(1, 1, -1, -a-b+c-r)
        # 3: -(a-x) - (b-y) - (c-z) = r 
        yield Formula(1, 1, 1, -a-b-c-r)

    # ax + by + cz + d = 0
    def __init__(self, a, b, c, d):
        self.a = a
        self.b = b
        self.c = c
        self.d = -d

    def resolve(f1, f2, f3):
        if f1.d > f2.d:
            f  = f1
            f1 = f2
            f2 = f
        if f1.d > f3.d:
            f  = f1
            f1 = f3
            f3 = f
        if f2.d > f3.d:
            f  = f2
            f2 = f3
            f3 = f

        k = (f1.a, f1.b, f1.c, f1.d, f2.a, f2.b, f2.c, f2.d, f3.a, f3.b, f3.c)
        if k in formulaProcessed:
            return None

        formulaProcessed.add(k)

        start = time()
        try:
            a = np.array([ [f1.a, f1.b, f1.c], [f2.a, f2.b, f2.c], [f3.a, f3.b, f3.c] ])
            b = np.array([ f1.d, f2.d, f3.d ])

            x, y, z = np.linalg.solve(a, b)
            if int(x) == x and int(y) == y and int(z) == z:
                return (int(x), int(y), int(z))
            else:
                return None
        except:
            return None
        finally:
            end = time()
            resolveTime[0] += (end-start)

    def solve(b1, b2, b3):
        for f1 in Formula.create(b1[X], b1[Y], b1[Z], b1[RADIUS]):
            for f2 in Formula.create(b2[X], b2[Y], b2[Z], b2[RADIUS]):
                if f1.a == f2.a and f1.b == f2.b and f1.c == f2.c:
                    if f1.d != f2.d:
                        continue # no solution

                for f3 in Formula.create(b3[X], b3[Y], b3[Z], b3[RADIUS]):
                    if f1.a == f3.a and f1.b == f3.b and f1.c == f3.c:
                        if f1.d != f3.d:
                            continue # no solution
                    if f3.a == f2.a and f3.b == f2.b and f3.c == f2.c:
                        if f3.d != f2.d:
                            continue # no solution

                    solution = Formula.resolve(f1, f2, f3)
                    if solution != None:
                        yield solution

def loadData():
    bots = []
    for line in open('2018/data/day23.data').readlines():
        line = line.strip()
        line = line[5:].replace('>, r=', ',').split(',')
        x, y, z, r = int(line[0]), int(line[1]), int(line[2]), int(line[3])
        bots.append((x, y, z, r))

    return bots

def distance(bot, x, y, z):
    d = abs(bot[X] - x) + abs(bot[Y] - y) + abs(bot[Z] - z)
    return d

def inRange(bot, x, y, z):
    return distance(bot, x, y, z) <= bot[RADIUS]

def rangeCount(bots, refBot) -> int:
    count = sum(( 1 for bot in bots if inRange(refBot, bot[X], bot[Y], bot[Z])))
    return count

def part1(bots):
    bots = sorted(bots, key=lambda b: b[RADIUS], reverse=True)
    mainBot = bots[0]
    answer = rangeCount(bots, mainBot)
    print("Answer to part 1 is", answer)

def calculate(bots, x0, y0, z0, size, steps):
    count = 0

    for b in bots:
        good = False
        for x in range(x0, x0+size+1, steps):
            if good:
                break
            for y in range(y0, y0+size+1, steps):
                if good:
                    break
                for z in range(z0, z0+size+1, steps):
                    if inRange(b, x, y, z):
                        good = True
                        break
        if good:
            count += 1

    return count

def getBestBoxes(bots, minPt, maxPt, size, steps):
    best = -1
    bestPt = []

    for x in range(minPt[X], maxPt[X], size):
        for y in range(minPt[Y], maxPt[Y], size):
            for z in range(minPt[Z], maxPt[Z], size):
                c = calculate(bots, x, y, z, size, steps)
                if c > best:
                    best = c
                    bestPt = [(x, y, z)]
                elif c == best:
                    bestPt.append((x, y, z))

    return best, bestPt

def part2(bots):
    SIZE_SPEED = 2
    STEP_SPEED = 5
    size = min(((MAXX-MINX) // SIZE_SPEED) , ((MAXY-MINY) // SIZE_SPEED) , ((MAXZ-MINZ) // SIZE_SPEED) )+1
    steps= size // STEP_SPEED
    score, bestBoxes = getBestBoxes(bots, (MINX, MINY, MINZ), (MAXX, MAXY, MAXZ), size, steps)

    while len(bestBoxes) > 0 and size > 1:
        boxes     = bestBoxes
        bestBoxes = []
        
        oldSize = size
        size = (size // SIZE_SPEED)+1
        if size == oldSize:
            size = oldSize // 2
        steps= (size // STEP_SPEED)+1
        score = 0
        for box in boxes:
            maxPt = (box[X]+oldSize, box[Y]+oldSize, box[Z]+oldSize)
            v, bs = getBestBoxes(bots, box, maxPt, size, steps)
            if v > score:
                bestBoxes = bs
                score = v
            elif v == score:
                bestBoxes += bs

    score = 0
    dist = -1
    pt = None

    for point in bestBoxes:
        value = sum((1 for bot in bots if inRange(bot, *point) ))
        if value > score:
            score    = value
            dist     = abs(point[X]) + abs(point[Y]) + abs(point[Z])
            pt       = point
        elif value == score:
            d1 = abs(point[X]) + abs(point[Y]) + abs(point[Z])
            if dist >= 0 and d1 < dist:
                dist = d1
                pt = point

    print("Answer to part 2 is", dist)

    # specialBotsIndexes = [i for i, bot in enumerate(bots) if distance(bot, *pt) == bot[RADIUS]]
    # for i in specialBotsIndexes:
    #     print(i)

def part3(bots):

    def isValid(bots, x, y, z):
        for b in bots:
            if not inRange(b, x, y, z):
                return False
        return True

    maxGroup = []

    for b1 in bots:
        if b1 in maxGroup:
            continue

        group = [b1]
        for b2 in bots:
            if b1 == b2:
                continue
            good = True
            for b3 in group:
                d = distance(b3, b2[X], b2[Y], b2[Z])
                if d > b3[RADIUS]+b2[RADIUS]:
                    good = False
                    break
            if good:
                group.append(b2)
        if len(group) > len(maxGroup):
            maxGroup = group

    specialBots = set()
    done = False

    for i in range(0, len(maxGroup)):
        b1 = maxGroup[i]
        for j in range(i+1, len(maxGroup)):
            b2 = maxGroup[j]
            d = distance(b1, b2[X], b2[Y], b2[Z])
            if d == b1[RADIUS]+b2[RADIUS]:
                specialBots.add(b1)
                specialBots.add(b2)

    processed = set()
    dist      = None

    for i1, b1 in enumerate(specialBots):
        print(i1,'of',len(specialBots))
        for i2, b2 in enumerate(specialBots):
            if i2 <= i1: 
                continue
            for i3, b3 in enumerate(specialBots):
                if i3 <= i2:
                    continue

                for point in Formula.solve(b1, b2, b3):
                    if point in processed:
                        continue
                    
                    processed.add(point)
                    x, y, z = point

                    if dist != None:
                        d = abs(x) + abs(y) + abs(z)
                        if d >= dist:
                            continue # won't be better so ignore

                    if isValid(maxGroup, x, y, z):
                        dist = abs(x) + abs(y) + abs(z)

    print("Answer to part 2 is", dist)

print("")
print("********************************")
print("* Advent of Code 2018 - Day 23 *")
print("********************************")
print("")

bots = loadData()

MINX = min((b[X] for b in bots))
MINY = min((b[Y] for b in bots))
MINZ = min((b[Z] for b in bots))
MAXX = max((b[X] for b in bots))
MAXY = max((b[Y] for b in bots))
MAXZ = max((b[Z] for b in bots))

part1(bots)

start = time()
part2(bots)
end = time()
print('part 2a executed in ', (end-start), 'seconds')

start = time()
part3(bots)
end = time()
print('part 2b executed in ', (end-start), 'seconds')
print("Numpy time:", resolveTime[0])