from random import randint

def loadData():
    bots = []
    for line in open('2018/data/day23.data').readlines():
        line = line.strip()
        line = line[5:].replace('>, r=', ',').split(',')
        x, y, z, r = int(line[0]), int(line[1]), int(line[2]), int(line[3])
        bots.append((x, y, z, r))

    return bots

def distance(bot, x, y, z):
    d = abs(bot[0] - x) + abs(bot[1] - y) + abs(bot[2] - z)
    return d

def inRange(bot, x, y, z):
    return distance(bot, x, y, z) <= bot[3]

def rangeCount(bots, refBot) -> int:
    count = sum(( 1 for bot in bots if inRange(refBot, bot[0], bot[1], bot[2])))
    return count

def part1(bots):
    bots = sorted(bots, key=lambda b: b[3], reverse=True)
    mainBot = bots[0]
    answer = rangeCount(bots, mainBot)

    print("Answer to part 1 is", answer)

def intersect(b1, b2) -> int:
    d = distance(b1, b2[0], b2[1], b2[2])
    return b1[3] + b2[3] - d

def brute(bots):

    minX = min((b[0] for b in bots))
    maxX = max((b[0] for b in bots))
    minY = min((b[1] for b in bots))
    maxY = max((b[1] for b in bots))
    minZ = min((b[2] for b in bots))
    maxZ = max((b[2] for b in bots))

    tested = set()

    p    = ( (minX + maxX) // 2, (minY + maxY) // 2, (minZ + maxX) // 2 )
    best = sum((1 for d in bots if inRange(d, *p)))

    if best == len(bots):
        yield p

    sizeX = 5000
    sizeY = 5000
    sizeZ = 5000

    print("Best =", best, "Pos =",*p)
    while True:
        mode = randint(1, 3)
        if mode == 1:
            s = randint(-sizeX, sizeX)
            xx = p[0] + s
            if xx < minX or xx > maxX:
                continue
            p2 = (xx, p[1], p[2])
        elif mode == 2:
            s = randint(-sizeY, sizeY)
            yy = p[1] + s
            if yy < minY or yy > maxY:
                continue
            p2 = (p[0], yy, p[2])
        else:
            s = randint(-sizeZ, sizeZ)
            zz = p[2] + s
            if zz < minZ or zz > maxZ:
                continue
            p2 = (p[0], p[1], zz)

        if not p2 in tested:
            count = sum((1 for d in bots if inRange(d, *p2)))
            tested.add(p2)
            if count >= best:
                if count > best:
                    print('---------------------')
                    print("Best =", count,"Pos =",*p2)
                elif count > 900:
                    print("Best =", count,"Pos =",*p2)
                best = count
                p = p2
            elif best > 9000 and count == best-1:
                if mode == 1:
                    minX = max(minX, min(p[0],p2[0]))
                    maxX = min(maxX, max(p[0],p2[0]))
                    s = (maxX - minX) // 4
                    if s == 0: s = 1
                    if s < sizeX:
                        sizeX = s
                        print('SizeX =',s)

                elif mode == 2:
                    minY = max(minY, min(p[1],p2[1]))
                    maxY = min(maxY, max(p[1],p2[1]))
                    s = (maxY - minY)
                    if s == 0: s = 1
                    if s < sizeY:
                        sizeY = s
                        print('SizeY =',s)

                else:
                    minZ = max(minZ, min(p[2],p2[2]))
                    maxZ = min(maxZ, max(p[2],p2[2]))
                    s = (maxZ - minZ)
                    if s == 0: s = 1
                    if s < sizeZ:
                        sizeZ = s
                        print('SizeY =',s)

            if count == len(bots):
                print("Found:", *p)
                yield p

def brute2(bots):
    X = 50012608
    Y = 19659012
    Z = 49855611
    best = 0

    size = 500
    for xx in range(-size, size+1):
        x = xx + X
        print('xx=',xx)
        for yy in range(-size, size+1):
            y = yy + Y
            # print('yy=',yy)
            for zz in range(-size, size+1):
                z = zz + Z
                count = sum((1 for d in bots if inRange(d, x, y, z)))
                if count > best:
                    best = count
                    print("Best =",best, "Position =", x, y, z)
                    if count == len(bots):
                        yield (x, y, z)

def part2a(bots):
    targets     = []
    deltas      = set()
    duplicates  = False

    for bot1 in bots:
        bs = [bot1]

        for bot2 in bots:
            if bot2 == bot1:
                continue

            good = True
            for bot3 in bs:
                delta = intersect(bot2, bot3)
                if delta < 0:
                    good = False
                    break
                else:
                    ok = bot3[0] >= 0 and bot3[1] >= 0 and bot3[2] >= 0 and bot2[0] >= 0 and bot2[1] >= 0 and bot2[2] >= 0
                    if ok:
                        b2 = bot2
                        b3 = bot3

                        d1 = (delta, b2, b3)
                        d2 = (delta, b3, b2)
                        if not d1 in deltas and not d2 in deltas:
                            deltas.add(d1)

            if good:
                bs.append(bot2)

        if len(bs) > len(targets):
            targets  = bs
            duplicates = False

        if len(targets) >= 985: # I know it's this so stop not
            break

    deltas = sorted(deltas)
    d1 = [(d[1], d[2]) for d in deltas if d[0] == 0]
    d2 = [(d[2], d[1]) for d in deltas if d[0] == 0 and (d[2], d[1]) not in d1]

    deltas = d1+d2

    # for pair in deltas:
    #     for p in brute3(*pair):
    #         print(*p)

    formulas = set()
    for d in deltas:
        b1 = d[0]
        b2 = d[1]
        formulas.add(f"abs({b1[0]} - x) + abs({b1[1]} - y) + abs({b1[2]} - z) = {b1[3]}")
        formulas.add(f"abs({b2[0]} - x) + abs({b2[1]} - y) + abs({b2[2]} - z) = {b2[3]}")

    formulas = sorted(formulas)

    for s in formulas:
        print(s)

    # print('delta',deltas[0][0])
    # answer = len(targets)

def part2(bots):
    X, Y, Z = 19021003, 24139578, 83255352

    max = 0
    pt  = None

    size = 100
    w = -1
    while w <= size:
        w += 1
        h = -1
        print(w, max)
        while h <= size:
            h += 1
            d = -1
            while d <= size:
                d += 1

                cs = [ 0, 0, 0, 0, 0, 0, 0, 0 ]
                ps = [
                    (X+w, Y+h, Z+d),
                    (X+w, Y+h, Z-d),
                    (X+w, Y-h, Z+d),
                    (X+w, Y-h, Z-d),
                    (X-w, Y+h, Z+d),
                    (X-w, Y+h, Z-d),
                    (X-w, Y-h, Z+d),
                    (X-w, Y-h, Z-d)
                ]

                def check(b, idx):
                    if inRange(b, *ps[idx]):
                        cs[idx] += 1
                        if cs[idx] > max:
                            return cs[idx]
                    return max

                for b in bots:
                    max = check(b, 0)
                    max = check(b, 1)
                    max = check(b, 2)
                    max = check(b, 3)
                    max = check(b, 4)
                    max = check(b, 5)
                    max = check(b, 6)
                    max = check(b, 7)

    # print("Count =",max, "pt =", *pt)

    print("Answer to part 2 is", 0)

print("")
print("********************************")
print("* Advent of Code 2018 - Day 23 *")
print("********************************")
print("")


bots = loadData()

part1(bots)
part2(bots)