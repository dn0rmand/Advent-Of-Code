from time import time
from parse import parse

from typing import Set, NamedTuple, List

class Position(NamedTuple):
    x: int
    y: int

class Grid(NamedTuple):
    data: List[List[chr]]
    minX: int
    maxX: int
    minY: int
    maxY: int
    sources: Set[Position]

INPUT_FILE_NAME = "2018/data/day17.data"

def loadData() -> Grid:
    grid = []

    minX, maxX, minY, maxY = 99999, 0, 99999, 0

    ## Figure out min and max for X and Y

    for line in open(INPUT_FILE_NAME).readlines():
        line = line.strip()
        if not line: continue

        s = parse("x={:d}, y={:d}..{:d}", line)
        if s == None:
            y1, x1, x2 = parse("y={:d}, x={:d}..{:d}", line)
            y2 = y1
        else:
            x1, y1, y2 = s
            x2 = x1

        minX = min(x1, minX)
        maxX = max(x2, maxX)
        minY = min(y1, minY)
        maxY = max(y2, maxY)

    ## create grid

    minX -= 10
    maxX += 10

    for _ in range(0, maxY+1):
        row = [' '] * ((maxX - minX) + 1)
        grid.append(row)

    ## fill grid

    for line in open(INPUT_FILE_NAME).readlines():
        line = line.strip()
        if not line: continue

        s = parse("x={:d}, y={:d}..{:d}", line)
        if s != None:
            x, y1, y2 = s
            x -= minX
            for y in range(y1, y2+1):
                grid[y][x] = '#'
        else:
            y, x1, x2 = parse("y={:d}, x={:d}..{:d}", line)
            r = grid[y]
            for x in range(x1-minX, x2+1-minX):
                r[x] = '#'

    ## done

    g = Grid(data=grid, minX=minX, maxX=maxX, minY=minY, maxY=maxY, sources=set())
    g.sources.add(Position(x=500-minX, y=0))

    return g

def dump(grid: Grid) -> None:
    for i, r in enumerate(grid.data):
        try:
            print(''.join(r))
        except:
            pass

W = '~'
F = '|'

def fill(grid: Grid) -> Position:
    S = grid.sources.pop()

    waterX, waterY = S

    maxY = grid.maxY
    maxX = grid.maxX - grid.minX

    G = grid.data

    while waterY+1 <= maxY and G[waterY+1][waterX] == ' ':
        waterY +=1
        G[waterY][waterX] = F

    if waterY+1 > maxY: # done
        return S

    overflowed= False

    if G[waterY+1][waterX] == W or G[waterY+1][waterX] == F: # reached some water ... check if already done
        x = waterX
        c = G[waterY+1][waterX]
        while x >= 0 and G[waterY+1][x] == c: x -= 1
        if x < 0 or G[waterY+1][x] == ' ':
            overflowed = True
        x = waterX
        while x <= maxX and G[waterY+1][x] == c: x += 1
        if x > maxX or G[waterY+1][x] == ' ':
            overflowed = True

    left, right = None, None

    while waterY >= 0 and not overflowed:
        G[waterY][waterX] = W
        x = waterX - 1
        # go left first
        while x >= 0 and G[waterY][x] != '#':
            c = G[waterY][x] 
            G[waterY][x] = W

            if G[waterY+1][x] == ' ': 
                if G[waterY+1][x+1] == W or G[waterY+1][x+1] == F: # error
                    G[waterY][x] = c
                    x += 1
                else:
                    # fall again
                    grid.sources.add(Position(x=x, y=waterY))
                overflowed = True
                break
            else:
                x -= 1
        left = x

        # go right
        x = waterX + 1
        while x <= maxX and G[waterY][x] != '#':
            c = G[waterY][x] 
            G[waterY][x] = W

            if G[waterY+1][x] == ' ': 
                if G[waterY+1][x-1] == W or G[waterY+1][x-1] == F: # error
                    G[waterY][x] = c
                    x -= 1
                else:
                    # fall again
                    grid.sources.add(Position(x=x, y=waterY))
                overflowed = True
                break
            else:
                x += 1

        right = x

        if overflowed:
            for x in range(left, right+1): 
                if G[waterY][x] == W:
                    G[waterY][x] = F

        waterY -= 1

    return S

def part1(grid: Grid) -> None:
    last = None

    while grid.sources:        
        last = fill(grid)

    # dump(grid)

    total = 0
    for r in grid.data[grid.minY:]:
        total += sum((1 for x in r if x == W or x == F))

    print("Part 1 answer is", total)

def part2(grid: Grid) -> None:
    total = 0
    for r in grid.data[grid.minY:]:
        total += sum((1 for x in r if x == W))

    print("Part 2 answer is", total)

print("")
print("********************************")
print("* Advent of Code 2018 - Day 17 *")
print("********************************")
print("")

start = time()

grid = loadData()

# dump(grid)

start1 = time()
part1(grid)
end = time()
print("Part 1 executed in ", round((end-start1)*1000), "ms")

start2 = time()
part2(grid)
end = time()

print("Part 2 executed in ", round((end-start2)*1000), "ms")
print
print("Total time (including loading data) is", round((end-start)*1000), "ms")