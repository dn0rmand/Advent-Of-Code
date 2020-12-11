from typing import List
from time import time
from time import sleep
from itertools import chain

def day18():
    INPUT_FILE_NAME = "2018/data/day18.data"

    OPEN_GROUND = '.'
    TREE        = '|'
    LUMBERYARD  = '#'
    NOTHING     = ' '

    class Grid:
        def __init__(self, size:int) -> None:
            grid = []
            other= []
            for _ in range(0, size):
                grid.append([NOTHING] * size)
                other.append([NOTHING] * size)

            self.data = grid
            self.other= other
            self.size = size

        def dump(self) -> None:
            for r in self.data:
                print(''.join(r))

        def makeKey(self) -> str:
            return ''.join(chain(*self.data))

        def loadData(self) -> None:
            data = []
            other= []        
            size = None

            for line in open(INPUT_FILE_NAME).readlines():
                line = line.strip()
                row = [c for c in line]
                if size == None:
                    size = len(row)
                elif size != len(row):
                    raise Exception("Rows of different size")
                data.append(row)
                other.append([NOTHING] * size)
            if size != len(data):
                raise Exception("Row count doesn't match")

            self.size = size
            self.data = data
            self.other= other

        def get(self, x: int, y:int) -> chr:
            if y < 0 or y >= self.size:
                return NOTHING
            if x < 0 or x >= self.size:
                return NOTHING

            return self.data[y][x]

        def set(self, x: int, y:int, c:chr) -> None:
            if y < 0 or y >= self.size:
                return
            if x < 0 or x >= self.size:
                return

            self.other[y][x] = c

        def adjacents(self, x:int, y:int) -> List[chr]:
            yield self.get(x-1, y-1)
            yield self.get(x  , y-1)
            yield self.get(x+1, y-1)

            yield self.get(x-1, y)
            # yield self.get(x, y)
            yield self.get(x+1, y)

            yield self.get(x-1, y+1)
            yield self.get(x  , y+1)
            yield self.get(x+1, y+1)

        def hasCount(self, x:int, y:int, count: int, value:chr) -> bool:
            for c in self.adjacents(x, y):
                if c == value:
                    count -= 1
                    if count == 0:
                        return True
            return False

        def value(self) -> int:
            trees       = 0
            lumberyards = 0

            for c in chain(*self.data):
                if c == TREE:
                    trees += 1
                elif c == LUMBERYARD:
                    lumberyards += 1

            return trees * lumberyards 

        def transform(self):
            for y, row in enumerate(self.data):
                for x, c in enumerate(row):
                    if c == OPEN_GROUND and self.hasCount(x, y, 3, TREE):
                        c = TREE
                    elif c == TREE and self.hasCount(x, y, 3, LUMBERYARD):
                        c = LUMBERYARD
                    elif c == LUMBERYARD and self.hasCount(x, y, 1, LUMBERYARD) and self.hasCount(x, y, 1, TREE):
                        c = LUMBERYARD
                    elif c == LUMBERYARD:
                        c = OPEN_GROUND

                    self.set(x, y, c)

            # swap arrays
            tmp = self.other
            self.other = self.data
            self.data  = tmp

            return self

    def part1(grid: Grid) -> None:
        for _ in range(0, 10):
            grid = grid.transform()

        print("Part 1 answer is", grid.value())

    def part2(grid: Grid) -> None:
        target  = 1000000000
        visited = {}
        step  = 0
        skipped = False

        while step < target:
            # grid.dump()
            # print('')
            # sleep(0.1)
            if not skipped:
                key = grid.makeKey()
                if key in visited:
                    count = step - visited[key]
                    step  = target - ((target - step) % count)
                    skipped = True
                else:
                    visited[key] = step

            grid = grid.transform()
            step += 1

        print("Part 2 answer is", grid.value())        

    print("")
    print("********************************")
    print("* Advent of Code 2018 - Day 18 *")
    print("********************************")
    print("")

    start = time()

    grid = Grid(1) # initialize with small size
    grid.loadData()

    part1(grid)

    # reload original data
    grid.loadData()
    part2(grid)

    end = time()
    print('Execute in ', (end-start), 'ms')