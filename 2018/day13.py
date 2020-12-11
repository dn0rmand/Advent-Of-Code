from time import time
from enum import Enum

def day13():
    """
    /->-\        
    |   |  /----\
    | /-+--+-\  |
    | | |  | v  |
    \-+-/  \-+--/
    \------/   
    """

    # from collections import namedtuple

    # Kart = namedtuple("Kart", "x, y, direction, nextTurn")

    # Kart Fields

    Cart_Y           = 0
    Cart_X           = 1
    Cart_DIRECTION   = 2
    Cart_NEXT_TURN   = 3
    Cart_ID          = 4
    Cart_DEAD        = 5

    # Directions

    class Direction(Enum):
        LEFT = 1
        RIGHT= 2
        UP   = 3
        DOWN = 4

    # Turns

    class Turn(Enum):
        LEFT   = 0
        NOT    = 1
        RIGHT  = 2

    def createKart(x, y, direction, id):
        k = [0, 0, 0, 0, 0, 0]
        k[Cart_X] = x
        k[Cart_Y] = y
        k[Cart_DIRECTION] = direction
        k[Cart_NEXT_TURN] = Turn.LEFT
        k[Cart_ID] = id
        k[Cart_DEAD] = False

        return k

    def loadData():
        grid = []
        karts= []

        for line in open('2018/data/day13.data', 'rt').readlines():
            line = line.strip('\n')
            if not line:
                continue
            row = []
            for c in line:
                if c == ">":
                    k = createKart(len(row), len(grid), Direction.RIGHT, len(karts)+1)
                    karts.append(k)
                    c = "-"
                elif c == "<":
                    k = createKart(len(row), len(grid), Direction.LEFT, len(karts)+1)
                    karts.append(k)
                    c = "-"
                elif c == "^":
                    k = createKart(len(row), len(grid), Direction.UP, len(karts)+1)
                    karts.append(k)
                    c = '|'
                elif c == "v":
                    k = createKart(len(row), len(grid), Direction.DOWN, len(karts)+1)
                    karts.append(k)
                    c = "|"

                row.append(c)
                
            grid.append(row)    

        return grid, karts

    def updatePosition(k):
        if k[Cart_DIRECTION] == Direction.UP:
            k[Cart_Y] -= 1
        elif k[Cart_DIRECTION] == Direction.DOWN:
            k[Cart_Y] += 1
        elif k[Cart_DIRECTION] == Direction.LEFT:
            k[Cart_X] -= 1
        elif k[Cart_DIRECTION] == Direction.RIGHT:
            k[Cart_X] += 1
        else:
            raise Exception("Invalid Direction")

    def moveKart(grid, k):
        c = grid[k[Cart_Y]][k[Cart_X]]

        if c == '/':

            if k[Cart_DIRECTION] == Direction.UP:
                k[Cart_DIRECTION] = Direction.RIGHT
            elif k[Cart_DIRECTION] == Direction.DOWN:
                k[Cart_DIRECTION] = Direction.LEFT
            elif k[Cart_DIRECTION] == Direction.LEFT:
                k[Cart_DIRECTION] = Direction.DOWN
            else:
                k[Cart_DIRECTION] = Direction.UP

        elif c == '\\':

            if k[Cart_DIRECTION] == Direction.UP:
                k[Cart_DIRECTION] = Direction.LEFT
            elif k[Cart_DIRECTION] == Direction.DOWN:
                k[Cart_DIRECTION] = Direction.RIGHT
            elif k[Cart_DIRECTION] == Direction.LEFT:
                k[Cart_DIRECTION] = Direction.UP
            else:
                k[Cart_DIRECTION] = Direction.DOWN

        elif c == '+':

            if k[Cart_NEXT_TURN] == Turn.LEFT:
                k[Cart_NEXT_TURN] = Turn.NOT
                if k[Cart_DIRECTION] == Direction.UP:
                    k[Cart_DIRECTION] = Direction.LEFT
                elif k[Cart_DIRECTION] == Direction.DOWN:
                    k[Cart_DIRECTION] = Direction.RIGHT
                elif k[Cart_DIRECTION] == Direction.LEFT:
                    k[Cart_DIRECTION] = Direction.DOWN
                elif k[Cart_DIRECTION] == Direction.RIGHT:
                    k[Cart_DIRECTION] = Direction.UP
                else:
                    raise Exception("Invalid Direction")

            elif k[Cart_NEXT_TURN] == Turn.NOT:
                k[Cart_NEXT_TURN] = Turn.RIGHT

            elif k[Cart_NEXT_TURN] == Turn.RIGHT:
                k[Cart_NEXT_TURN] = Turn.LEFT
                if k[Cart_DIRECTION] == Direction.UP:
                    k[Cart_DIRECTION] = Direction.RIGHT
                elif k[Cart_DIRECTION] == Direction.DOWN:
                    k[Cart_DIRECTION] = Direction.LEFT
                elif k[Cart_DIRECTION] == Direction.LEFT:
                    k[Cart_DIRECTION] = Direction.UP
                elif k[Cart_DIRECTION] == Direction.RIGHT:
                    k[Cart_DIRECTION] = Direction.DOWN
                else:
                    raise Exception("Invalid Direction")

            else:
                raise Exception("Invalid Next Turn")

        elif c != '-' and c != '|':
            raise Exception("WHAT! Not Possible!")

        updatePosition(k)

    def run(part1):

        grid, karts = loadData()

        while True:

            # remove DEAD karts
            karts = [k for k in karts if not k[Cart_DEAD]]
            if len(karts) == 1:
                if part1:
                    raise Exception("Well, that's not right")
                return karts[0][Cart_X], karts[0][Cart_Y]

            # sort karts
            sortedKarts = sorted(karts)

            # execute tick loop
            for k in sortedKarts:
                if k[Cart_DEAD]:
                    continue

                moveKart(grid, k)

                # this isn't very optimum, but it might be good enough
                for k2 in karts:
                    if k2[Cart_DEAD]:
                        continue

                    if k[Cart_ID] != k2[Cart_ID] and k[Cart_X] == k2[Cart_X] and k[Cart_Y] == k2[Cart_Y]: # CRASH!
                        k[Cart_DEAD] = True
                        k2[Cart_DEAD] = True
                        if part1:
                            return k[Cart_X], k[Cart_Y]

    def part1():
        x, y = run(True)
        print("Answer to part 1 is {x},{y}".format(x=x, y=y))

    def part2():
        x, y = run(False)
        print("Answer to part 2 is {x},{y}".format(x=x, y=y))

    print("")
    print("********************************")
    print("* Advent of Code 2018 - Day 13 *")
    print("********************************")
    print("")

    start = time()
    part1()
    part2()
    end = time()
    print("Executed in ", round((end-start)*1000), "ms")