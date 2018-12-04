class World:
    def __init__(self, size):
        self.world = []
        self.ids   = {}

        for i in range(0, size):
            self.world.append([0] * size)

    def goodIds(self):
        for id in self.ids:
            if self.ids[id]:
                yield id

    def all(self, predicate):
        for line in self.world:
            for space in line:
                if predicate(space):
                    yield space

    def importLine(self, input):
        input = input.strip('#')
        values = input.split(' ')
        xy = values[2].split(',')
        wh = values[3].split('x')

        id = int(values[0])
        x  = int(xy[0])
        y  = int(xy[1].strip(':'))
        w  = int(wh[0])
        h  = int(wh[1])

        self.ids[id] = True

        for yy in range(y, y+h):
            line = self.world[yy]
            for xx in range(x, x+w):
                other = line[xx]
                if other == 0:
                    line[xx] = id
                else:                    
                    line[xx]   = -1
                    self.ids[id]    = False
                    if other > 0:
                        self.ids[other] = False

def loadTest():
    world = World(10)
    world.importLine("#1 @ 1,3: 4x4")
    world.importLine("#2 @ 3,1: 4x4")
    world.importLine("#3 @ 5,5: 2x2")
    return world

def loadWorld():
    world = World(1010)

    data = open('2018/data/day3.data', 'rt')

    input = data.readline().strip()
    while input:
        world.importLine(input)
        input = data.readline().strip()

    data.close()
    return world

def part1(world):
    predicate = lambda a : a < 0
    area = sum(1 for _ in world.all(predicate))
    print("Answer part 1 is", area)

def part2(world):    
    answer = 0
    for id in world.goodIds():
        if answer == 0:
            answer = id
        else:
            raise Exception('Should not have two good ids')

    print("Answer part 2 is", answer)

print("")
print("*******************************")
print("* Advent of Code 2018 - Day 3 *")
print("*******************************")
print("")

# world = loadTest()
world = loadWorld()

part1(world)
part2(world)

print("")
