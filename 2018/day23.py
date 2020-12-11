from time import time

def day23():
    X = 0
    Y = 1
    Z = 2
    RADIUS = 3

    resolveTime = [0]

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
    print('part 2 executed in ', (end-start), 'seconds')
