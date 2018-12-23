from typing import List, NamedTuple
from itertools import chain
from time import time

X = 0
Y = 1
TOOL = 2
TIME = 3

NOTHING  = 0
TORCH    = 1
CLIMBING = 2

ROCKY = 0
WET   = 1
NARROW= 2

class Cave:
    def __init__(self, targetX: int, targetY: int, depth: int) -> None:
        self.target  = (targetX, targetY)
        self.width   = targetX+1
        self.height  = targetY+1
        self.depth   = depth
        self.erosions= {}
        self.erosions[(0, 0)] = depth % 20183
        self.erosions[self.target] = depth % 20183

    def getErosionsLevel(self, x:int, y:int) -> int:
        if x < 0 or y < 0:
            raise Exception('Invalid position')

        pos = (x, y)

        if pos in self.erosions:
            return self.erosions[pos]

        if x == 0:
            r = ((y * 48271) + self.depth) % 20183
        elif y == 0:
            r = ((x * 16807) + self.depth) % 20183
        else:
            r = self.getErosionsLevel(x-1,y) * self.getErosionsLevel(x, y-1)
            r = (r + self.depth) % 20183

        self.erosions[pos] = r
        return r

    def getType(self, x: int, y: int) -> int:
        return self.getErosionsLevel(x, y) % 3

    def getRiskLevel(self) -> int:
        risk = 0
        for x in range(0, self.width):
            for y in range(0, self.height):
                risk += self.getType(x, y)
        return risk

    def findShortestPath(self) -> int:
        shortest = None
        states = [(0, 0, TORCH, 0)]
        visited = {}
        newStates = {}

        def makeKey(state):
            return (state[X], state[Y], state[TOOL])

        def isToolAllowed(state, tool):
            type = self.getType(state[X], state[Y])

            if (state[X] == self.target[X] and state[Y] == self.target[Y]) or (state[X] == 0 and state[Y] == 0):
                return tool == TORCH

            if type == ROCKY:
                return tool == TORCH or tool == CLIMBING
            elif type == WET:
                return tool == CLIMBING or tool == NOTHING
            else:
                return tool == NOTHING or tool == TORCH

        def checkMove(state, xx: int, yy: int) -> None:
            xx = state[X] + xx
            yy = state[Y] + yy
            if xx < 0 or yy < 0:
                return
            if xx == 0 and yy == 0:
                return

            if xx >= self.width+50 or yy >= self.height+50:  # don't wander too much 
                return

            possibilities = set()

            if (xx, yy) == self.target:
                if state[TOOL] == TORCH:
                    possibilities.add((xx, yy, TORCH, state[TIME]+1))
                elif isToolAllowed(state, TORCH):
                    possibilities.add((xx, yy, TORCH, state[TIME]+8))
            else:
                type = self.getType(xx, yy)

                if type == ROCKY: # climbing or torch
                    if state[TOOL] != NOTHING: # don't have to change
                        possibilities.add((xx, yy, state[TOOL], state[TIME]+1))

                    if state[TOOL] == NOTHING or state[TOOL] == CLIMBING:
                        if isToolAllowed(state, TORCH):
                            possibilities.add((xx, yy, TORCH, state[TIME]+8))
                    if state[TOOL] == NOTHING or state[TOOL] == TORCH:
                        if isToolAllowed(state, CLIMBING):
                            possibilities.add((xx, yy, CLIMBING, state[TIME]+8))
                elif type == WET: # climbing or nothing
                    if state[TOOL] != TORCH: # don't have to change
                        possibilities.add((xx, yy, state[TOOL], state[TIME]+1))

                    if state[TOOL] == NOTHING or state[TOOL] == TORCH:
                        if isToolAllowed(state, CLIMBING):
                            possibilities.add((xx, yy, CLIMBING, state[TIME]+8))
                    if state[TOOL] == CLIMBING or state[TOOL] == TORCH:
                        if isToolAllowed(state, NOTHING):
                            possibilities.add((xx, yy, NOTHING, state[TIME]+8))
                else: # NARROW    # torch or nothing 
                    if state[TOOL] != CLIMBING: # don't have to change
                        possibilities.add((xx, yy, state[TOOL], state[TIME]+1))

                    if state[TOOL] == NOTHING or state[TOOL] == CLIMBING:
                        if isToolAllowed(state, TORCH):
                            possibilities.add((xx, yy, TORCH, state[TIME]+8))
                    if state[TOOL] == CLIMBING or state[TOOL] == TORCH:
                        if isToolAllowed(state, NOTHING):
                            possibilities.add((xx, yy, NOTHING, state[TIME]+8))

            for s in possibilities:
                if shortest != None and s[TIME] >= shortest:
                    continue

                k = makeKey(s)
                if k in visited and visited[k] <= s[TIME]:
                    continue
                if k in newStates and newStates[k] <= s[TIME]:
                    continue

                newStates[k] = s[TIME]

        while len(states) > 0:
            newStates.clear()

            for state in states:
                k = makeKey(state)
                if not k in visited or visited[k] > state[TIME]:
                    visited[k] = state[TIME]

            for state in states:
                if (state[X], state[Y]) == self.target: # target reached
                    if state[TOOL] != TORCH:
                        raise Exception("Should have the Torch")

                    if shortest == None or state[TIME] < shortest:
                        shortest = state[TIME]
                    continue

                checkMove(state,  0, -1)
                checkMove(state, -1,  0)
                checkMove(state,  1,  0)
                checkMove(state,  0,  1)

            states = [(s[X], s[Y], s[TOOL], newStates[s]) for s in newStates]

        return shortest

    def dump(self, w, h) -> None:
        types = ['.', '=', '|']

        for y in range(0, h):
            s = ""
            for x in range(0, w):
                if y == 0 and x == 0: 
                    s += 'M'
                elif y == self.height-1 and x == self.width-1:
                    s += 'T'
                else:
                    s += types[self.getType(x, y)]
            print(s)
        print('')

def part1(cave: Cave) -> None:
    answer = cave.getRiskLevel()
    print("Answer part 1 is", answer) # 11843

def part2(cave: Cave) -> None:
    answer = cave.findShortestPath()
    print("Answer part 2 is", answer)

print("")
print("********************************")
print("* Advent of Code 2018 - Day 22 *")
print("********************************")
print("")

depth  = 4080
target = (14, 785)

# depth = 510
# target = (10, 10)

cave = Cave(target[0], target[1], depth)
# cave.dump(16, 16)
part1(cave)

start = time()
part2(cave)
end = time()
print('Part 2 solved in', (end-start), 'seconds')
