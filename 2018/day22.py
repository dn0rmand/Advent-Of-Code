from typing import List, NamedTuple
from itertools import chain
from time import time

def day22():
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
            self.maxX    = targetX + 1 + 50
            self.maxY    = targetY + 1 + 50
            self.depth   = depth
            self.erosions= {}
            self.erosions[(0, 0)] = depth % 20183
            self.erosions[self.target] = depth % 20183

        def getErosionsLevel(self, x:int, y:int) -> int:
            if x < 0 or y < 0:
                raise Exception('Invalid position')

            pos = (x << 10) | y

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

        def decodeKey(self, k: int):
            tool = k & 0x3
            y    = (k >> 2) & 0x3FF
            x    = k >> 12
            return x, y, tool

        def makeKey(self, x:int, y:int, tool:int) -> int:
            k = (x << 12) | (y << 2) | tool
            return k

        def findShortestPath(self) -> int:
            shortest  = None
            states    = {}
            visited   = {}
            newStates = {}

            states[self.makeKey(0, 0, TORCH)] = 0

            def isToolAllowed(type, tool):
                return tool != type
                # if type == ROCKY:
                #     return tool == TORCH or tool == CLIMBING
                # elif type == WET:
                #     return tool == CLIMBING or tool == NOTHING
                # else:
                #     return tool == NOTHING or tool == TORCH

            def addPossibility(xx, yy, tool, time):
                if shortest != None and time >= shortest:
                    return

                k = self.makeKey(xx, yy, tool)
                if k in visited and visited[k] <= time:
                    return
                if k in newStates and newStates[k] <= time:
                    return

                newStates[k] = time

            def checkMove(xx:int, yy:int, tool:int, time:int , type1: int) -> None:
                if xx < 0 or yy < 0:
                    return
                if xx == 0 and yy == 0:
                    return

                if shortest != None and time+1 >= shortest:
                    return # no need to check

                if xx >= self.maxX or yy >= self.maxY:  # don't wander too much 
                    return

                if xx == self.target[X] and yy == self.target[Y]:
                    if tool == TORCH:
                        addPossibility(xx, yy, TORCH, time+1)
                    elif isToolAllowed(type1, TORCH):
                        addPossibility(xx, yy, TORCH, time+8)
                else:
                    type  = self.getType(xx, yy)

                    if type == ROCKY: # climbing or torch
                        if tool != NOTHING: # don't have to change
                            addPossibility(xx, yy, tool, time+1)

                        if tool == NOTHING or tool == CLIMBING:
                            if isToolAllowed(type1, TORCH):
                                addPossibility(xx, yy, TORCH, time+8)
                        if tool == NOTHING or tool == TORCH:
                            if isToolAllowed(type1, CLIMBING):
                                addPossibility(xx, yy, CLIMBING, time+8)
                    elif type == WET: # climbing or nothing
                        if tool != TORCH: # don't have to change
                            addPossibility(xx, yy, tool, time+1)

                        if tool == NOTHING or tool == TORCH:
                            if isToolAllowed(type1, CLIMBING):
                                addPossibility(xx, yy, CLIMBING, time+8)
                        if tool == CLIMBING or tool == TORCH:
                            if isToolAllowed(type1, NOTHING):
                                addPossibility(xx, yy, NOTHING, time+8)
                    else: # NARROW    # torch or nothing 
                        if tool != CLIMBING: # don't have to change
                            addPossibility(xx, yy, tool, time+1)

                        if tool == NOTHING or tool == CLIMBING:
                            if isToolAllowed(type1, TORCH):
                                addPossibility(xx, yy, TORCH, time+8)
                        if tool == CLIMBING or tool == TORCH:
                            if isToolAllowed(type1, NOTHING):
                                addPossibility(xx, yy, NOTHING, time+8)

            target = self.makeKey(self.target[X], self.target[Y], 0) // 10

            while len(states) > 0:
                newStates.clear()

                for k in states:
                    visited[k] = states[k]

                for k in states:
                    x, y, tool = self.decodeKey(k)
                    time       = states[k]

                    if x == self.target[X] and y == self.target[Y]: # target reached
                        t = time
                        if tool != TORCH:
                            t += 7

                        if shortest == None or t < shortest:
                            shortest = t
                        continue

                    type = self.getType(x, y)
                    checkMove(x, y-1, tool, time, type)
                    checkMove(x-1, y, tool, time, type)
                    checkMove(x+1, y, tool, time, type)
                    checkMove(x, y+1, tool, time, type)

                old = states
                states = newStates
                newStates = old

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
