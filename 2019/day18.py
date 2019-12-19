import time

KEY_MASK = {}

for i in range(0, 26):
    k = chr(ord('a') + i)
    KEY_MASK[k] = 2**i

class Map:
    def __init__(self, data: [[chr]]) -> None:
        self.data = data
        self.entry = None
        self.allKeys = 0

        keys  = []
        doors = []

        for y in range(0, len(data)):
            for x in range(0, len(data[y])):
                c = data[y][x]
                if c == '@':
                    if self.entry != None:
                        raise Exception("Multiple entries found")
                    self.entry = (x, y)
                    data[y][x] = '.'
                if c >= 'a' and c <= 'z':
                    self.allKeys |= KEY_MASK[c]
                    if c in keys:
                        raise Exception(f"key {c} found multiple times")
                    keys.append(c)
                if c >= 'A' and c <= 'Z':
                    if c in doors:
                        raise Exception(f"door {c} found multiple times")
                    doors.append(c)

        self.keyCount = len(keys)

        if self.entry == None:
            raise Exception("No entries found")
        if len(keys) < len(doors):
            raise Exception("Less keys than doors")
        for k in doors:
            if not k.lower() in keys:
                raise Exception(f"No key for door {k}")

    def get(self, x: int, y: int, keys: int) -> chr:
        if y < 0 or x < 0 or y >= len(self.data) or x >= len(self.data[y]):
            return '#'

        c = self.data[y][x]
        if c in ['.', '#']:
            return c
        if c == c.upper(): # it's a door
            if (KEY_MASK[c.lower()] & keys) != 0: # but I have the key
                return '.'
            else:
                return '#' # door is locked

        return c

    def dump(self) -> None:
        for row in self.data:
            print("".join(row))

    def closeDeadEnds(self, entries) -> None:
        reset = True
        while reset:
            reset = False
            for y in range(1, len(self.data)-1):
                row = self.data[y]
                for x in range(1, len(self.data[y])-1):
                    if (x, y) in entries:
                        continue
                    if self.data[y][x] == '.':
                        c = 1 if self.data[y-1][x] == '#' else 0
                        c+= 1 if self.data[y+1][x] == '#' else 0
                        c+= 1 if self.data[y][x-1] == '#' else 0
                        c+= 1 if self.data[y][x+1] == '#' else 0
                        if c >= 3:
                            self.data[y][x] = '#'
                            reset = True
                            break
                if reset:
                    break
class State:
    def __init__(self, keys: int = 0, keyCount: int = 0) -> None:
        self.keys = keys
        self.keyCount = keyCount

    def addKey(self, key: chr) -> None:
        if key >= 'a' and key <= 'z':
            m = KEY_MASK[key]
            if (self.keys & m) == 0:
                self.keys |= m
                self.keyCount += 1

    def hash(self):
        return self.keys

    def move(self, map: Map):
        return None

class State1(State):
    def __init__(self, x: int, y: int, keys: int = 0, keyCount: int = 0) -> None:
        super().__init__(keys, keyCount)
        self.x    = x
        self.y    = y

    def hash(self):
        return self.x*100 + self.y + (super().hash()*100000)

    def move(self, map: Map):
        yield from self.__move__(0, -1, map)
        yield from self.__move__(0,  1, map)
        yield from self.__move__(-1, 0, map)
        yield from self.__move__( 1,  0, map)

    def __move__(self, dx: int, dy: int, map: Map):
        x = self.x + dx
        y = self.y + dy

        c = map.get(x, y, self.keys)
        if c != '#':
            s = State1(x, y, self.keys, self.keyCount)
            s.addKey(c)
            yield s, s.hash()

class State2(State):
    def __init__(self, keys: int = 0, keyCount: int = 0) -> None:
        super().__init__(keys, keyCount)

    def start(x: int, y: int):
        s = State2()
        s.robots = (
            (x-1, y-1),
            (x+1, y-1),
            (x-1, y+1),
            (x+1, y+1)
        )
        return s

    def hash(self):
        def makeKey(x: int, y: int) ->int:
            return x*100 + y

        return (makeKey(*self.robots[0]), makeKey(*self.robots[1]), makeKey(*self.robots[2]), makeKey(*self.robots[3]), super().hash())

    def move(self, map: Map):

        def __move__(map: Map, dx: int, dy: int, robot):
            x, y = self.robots[robot]
            x += dx
            y += dy

            c = map.get(x, y, self.keys)
            if c == '#':
                return

            s = State2(self.keys, self.keyCount)
            s.addKey(c)
            robots = list(self.robots)
            robots[robot] = (x, y)
            s.robots = tuple(robots)
            yield s, s.hash()

        for i in range(0, len(self.robots)):
            yield from __move__(map, 0,-1, i)
            yield from __move__(map, 0, 1, i)
            yield from __move__(map,-1, 0, i)
            yield from __move__(map, 1, 0, i)

def loadData(prefix: str) -> Map:
    map  = [[]]
    prefix = "--- " + prefix + " ---"
    with open("2019/Data/day18.data", 'rt') as file:
        foundPrefix = False
        for line in file:
            line = line.strip('\n')
            if not foundPrefix:
                if line == prefix:
                    foundPrefix = True
            elif line.startswith("--- "):
                break
            else:
                map.append([c for c in line])

        if not foundPrefix:
            raise Exception(F"map for {prefix} not found")
    return Map(map)

def solve(map: Map, start: State, trace: bool = False, part2: bool = False) -> int:
    states  = [start]

    steps   = 0
    count   = 1
    visited = {}

    keysFound = 0

    while len(states) > 0:
        if trace:
            print(f"\r{steps} - {len(states)} - {keysFound}    ", end="")

        newStates = {}
        changed = False
        for state in states:
            visited[state.hash()] = 1
            if state.keys == map.allKeys:
                return steps

            for s, k in state.move(map):
                if not k in newStates and not k in visited:
                    if part2 and s.keyCount < keysFound:
                        continue
                    if part2 and s.keyCount > keysFound:
                        keysFound = s.keyCount
                        newStates = {}
                        changed = True

                    newStates[k] = s

        if changed:
            visited = {}
        steps += 1
        states = [s for s in newStates.values()]

    raise Exception("No solution found")

def part1(map: Map, trace: bool = False) -> int:
    map.closeDeadEnds([map.entry])
    return solve(map, State1(*map.entry), trace)

def part2(map: Map, trace: bool = False) -> int:
    x, y = map.entry
    map.data[y][x]   = '#'
    map.data[y][x+1] = '#'
    map.data[y][x-1] = '#'
    map.data[y-1][x] = '#'
    map.data[y+1][x] = '#'
    start = State2.start(x, y)

    map.closeDeadEnds(start.robots)
    # map.data[y][x]   = '@'
    # map.dump()
    # map.data[y][x]   = '#'

    answer = solve(map, start, trace, True)
    return answer

def runTest(name: str, expected1: int, expected2: int = None) -> None:
    map = loadData(name)
    if expected1 != None:
        assert part1(map) == expected1
    if expected2 != None:
        assert part2(map) == expected2
    print(name, "passed")

print("")
print("********************************")
print("* Advent of Code 2019 - Day 16 *")
print("********************************")
print("")

runTest("TEST4", None, 32)

runTest("TEST1", 132)
runTest("TEST2", 136)
runTest("TEST3", 81)

map = loadData('PUZZLE')

t = time.perf_counter()
print("Answer part 1 is", part1(map, True))
t = int((time.perf_counter()-t) * 100)/100
print(f"Part 1 executed in {t} seconds")

map = loadData('PUZZLE')

t = time.perf_counter()
print("Answer part 2 is", part2(map, True))
t = int((time.perf_counter()-t) * 100)/100
print(f"Part 2 executed in {t}ms")
