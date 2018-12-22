from typing import List, NamedTuple
from itertools import chain

class Cave:
    def __init__(self, targetX: int, targetY: int, depth: int) -> None:
        self.width   = targetX+1
        self.height  = targetY+1
        self.depth   = depth
        self.types   = []
        self.erosions= []

        for y in range(0, self.height):
            self.types.append([-1] * self.width)
            erosions = [-1] * self.width
            erosions[0] = ((y * 48271) + depth) % 20183 
            self.erosions.append(erosions)
        for x in range(0, self.width):
            self.erosions[0][x] = ((x * 16807) + depth) % 20183

        self.erosions[0][0] = depth % 20183
        self.erosions[targetY][targetX] = depth % 20183

    def getErosionsLevel(self, x:int, y:int) -> int:
        if x < 0 or x >= self.width or y < 0 or y >= self.height:
            raise Exception('Invalid position')
        v = self.erosions[y][x]
        if v > 0: 
            return v
        r1 = self.getErosionsLevel(x-1,y) * self.getErosionsLevel(x, y-1)
        r1 = (r1 + self.depth) % 20183
        self.erosions[y][x] = r1
        return r1

    def getType(self, x: int, y: int) -> int:
        if x < 0 or x >= self.width or y < 0 or y >= self.height:
            raise Exception('Invalid position')
        v = self.types[y][x]
        if v >= 0:
            return v
        r = self.getErosionsLevel(x, y) % 3
        self.types[y][x] = r
        return r

    def getRiskLevel(self) -> int:
        risk = sum((v for v in chain(*self.types)))
        return risk

    def build(self) -> None:
        for y in range(0, self.height):
            w = min(self.width, y+1)
            for x in range(0, w):
                self.getType(x, y)
                if y < self.width:
                    self.getType(y, x)
                    self.getType(y, y)

    def dump(self) -> None:
        types = ['.', '=', '|']

        for y in range(0, self.height):
            s = ""
            for x in range(0, self.width):
                if y == 0 and x == 0: 
                    s += 'M'
                else:
                    if self.types[y][x] < 0:
                        print(x,',',y,"wasn't calculated")
                    s += types[self.getType(x, y)]
            print(s)
        print('')

def part1(x: int, y:int, depth:int) -> None:
    cave = Cave(x, y, depth)
    cave.build()
    cave.dump()
    answer = cave.getRiskLevel()

    print("Answer part 1 is", answer) # 11843

print("")
print("********************************")
print("* Advent of Code 2018 - Day 22 *")
print("********************************")
print("")

# depth: 4080
# target: 14,785
part1(14, 785, 4080)
