from parse import parse

def day7():
    TIME = 0
    VALUE= 1

    class Engine:
        def __init__(self, instructions, workers, delay):
            self.pending = set()
            self.tasks   = [None] * workers        
            self.instructions = instructions
            self.delay   = delay
            self.done    = set(i for i in instructions if len(instructions[i]) == 0)
            self.notdone = set(i for i in instructions if not i in self.done)
            self.available = sorted([i for i in self.done])
            self.count   = len(instructions)
            self.answer  = ""

        def isAvailable(self, value):
            if value in self.pending:
                return False
            for i in self.instructions[value]:
                if not i in self.done:
                    return False
            return True

        def markDone(self, value):
            if value in self.notdone:
                self.notdone.remove(value)
            self.done.add(value)
            self.count  -= 1
            self.answer += value
            self.pending.remove(value)
            self.available = sorted([i for i in self.notdone if self.isAvailable(i)])
            
        def assignNext(self):
            if len(self.available) > 0:
                value = self.available[0]
                self.available.remove(value)
                work = [0, 0]
                work[VALUE] = value
                work[TIME]  = self.delay(value)
                self.pending.add(value)
                return work
            else:
                return None

        def doWork(self, work):
            work[TIME] -= 1
            if work[TIME] == 0:
                value = work[VALUE]
                self.markDone(value)
                return None
            else:
                return work

        def finished(self):
            return self.count == 0

        def process(self):
            hasDoneSomething = False

            # Run the pending ones
            for i in range(0, len(self.tasks)):
                if self.tasks[i] != None:
                    self.tasks[i] = self.doWork(self.tasks[i])
                    hasDoneSomething = True

            # Assign new work
            for i in range(0, len(self.tasks)):
                if self.tasks[i] == None:
                    self.tasks[i] = self.assignNext()

            return 1 if hasDoneSomething else 0

    def loadData():
        instructions = {}

        for line in open('2018/data/day7.data', 'rt'):
            line = line.strip()
            if len(line) > 0:
                parent, id = parse("Step {:w} must be finished before step {:w} can begin.", line.strip())
                if not parent in instructions:
                    instructions[parent] = []
                if not id in instructions:
                    instructions[id] = []
                instructions[id].append(parent)
                
        return instructions

    def part1(instructions):
        engine = Engine(instructions, 1, lambda x : 1)

        while not engine.finished():
            engine.process()

        print("Answer part 1 is", engine.answer)

    def part2(instructions):
        engine = Engine(instructions, 5, lambda value : 61 + ord(value) - ord('A'))
        time = 0

        while not engine.finished():
            time += engine.process()

        print("Answer part 2 is", time)

    print("")
    print("*******************************")
    print("* Advent of Code 2018 - Day 7 *")
    print("*******************************")
    print("")

    instructions = loadData()

    part1(instructions)
    part2(instructions)

