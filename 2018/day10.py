from collections import defaultdict
from collections import namedtuple

def day10():
    Point = namedtuple("Point", "x, y, vx, vy")

    def loadData():
        points = []

        for line in open('2018/data/day10.data', 'rt'):
            x = int(line[10:16])
            y = int(line[18:24])
            vx= int(line[36:38])
            vy= int(line[40:42])
            points.append(Point(x=x, y=y, vx=vx, vy=vy))
        return points

    def calculate(points, time):
        minX, maxX, minY, maxY = 99999,-99999,99999,-99999 

        for point in points:
            x = point.x + time * point.vx
            y = point.y + time * point.vy

            minX = min(x, minX)
            minY = min(y, minY)
            maxX = max(x, maxX)
            maxY = max(y, maxY)

        w = maxX - minX
        h = maxY - minY

        return minX, minY, w, h

    def dump(points, time):
        x, y, w, h = calculate(points, time)

        print('')
        for yy in range(y, y+h+1):
            pts = (p.x + time * p.vx - x for p in points if p.y + time * p.vy == yy)
            line = [' ']*(w+1)
            for xx in pts:
                line[xx] = '#'
            print(''.join(line))
        print('')

    def solve(points):
        time = 10000
        _, _, _, h = calculate(points, time)

        previous = h
        while True:
            _, _, _, h = calculate(points, time+1)
            if h > previous:
                break
            previous = h
            time += 1

        print("Answer to Part 1 is:")
        dump(points, time)
        print("Answer to part 2 is", time)

    print("")
    print("********************************")
    print("* Advent of Code 2018 - Day 10 *")
    print("********************************")
    print("")

    points = loadData()
    solve(points)
