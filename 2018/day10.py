from collections import defaultdict

X = 1
Y = 0
VX= 2
VY= 3

def loadData():
    points = []
    for line in open('2018/data/day10.data', 'rt'):
        x = line[10:16]
        x = int(x)
        y = line[18:24]
        y = int(y)
        vx= line[36:38]
        vx= int(vx)
        vy= line[40:42]
        vy= int(vy)
        points.append([y, x, vx, vy])
    return points

def move(points):
    minX, maxX, minY, maxY = 99999,-99999,99999,-99999 

    for point in points:
        point[X] += point[VX]
        point[Y] += point[VY]
        if point[X] < minX: minX = point[X]
        if point[X] > maxX: maxX = point[X]
        if point[Y] < minY: minY = point[Y]
        if point[Y] > maxY: maxY = point[Y]

    w = maxX - minX
    h = maxY - minY

    if h >= 10:
        return False, minX, minY, w, h
    else:
        return True, minX, minY, w, h

def dump(points, x, y, w, h):
    print('')
    for yy in range(y, y+h+1):
        pts = (p[X]-x for p in points if p[Y] == yy)
        line = [' ']*(w+1)
        for xx in pts:
            line[xx] = '#'
        print(''.join(line))
    print('')

def solve(points):
    time = 0
    d = False
    while not d:
        d, x, y, w, h = move(points)
        time += 1

    print("Answer to Part 1 is:")
    dump(points, x, y, w, h)
    print("Answer to part 2 is", time)

print("")
print("*******************************")
print("* Advent of Code 2018 - Day 10*")
print("*******************************")
print("")

points = loadData()
solve(points)
