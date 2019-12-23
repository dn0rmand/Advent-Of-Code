from collections import deque

REVERSE   = 1
INCREMENT = 2
CUT       = 3

def load():
    operations  = []
    with open("2019/Data/day22.data", 'rt') as file:
        for line in file:
            line = line.split(' ')
            operation = None
            if line[0] == "cut":
                operation = (CUT, int(line[1]))
            elif line[1] == "into":
                operation = (REVERSE, 0)
            else:
                assert line[1] == "with"
                operation = (INCREMENT, int(line[3]))

            operations.append(operation)

    return operations

def performReverse(deck: deque, size: int = None) -> deque:
    deck.reverse()
    return deck

def performCut(deck: deque, size: int) -> deque:
    deck.rotate(-size)
    return deck

def performIncrement(deck: deque, size: int) -> deque:
    deck2 = deque(deck)
    idx = 0
    for x in deck:
        deck2[idx] = x
        idx = (idx + size) % len(deck)
    return deck2

def reShuffle(operations: [], deck: deque) -> deque:
    OPS = [0, 1, 2, 4]
    OPS[REVERSE]  = performReverse
    OPS[CUT]      = performCut
    OPS[INCREMENT]= performIncrement

    for operation in operations:
        deck = OPS[operation[0]](deck, operation[1])

    return deck

def shuffle(operations: [], deckSize: int = 10) -> deque:
    deck = deque([i for i in range(0, deckSize)])
    return reShuffle(operations, deck)

def speedShuffle(operations: [], index: int, deckSize: int = 10) -> int:
    for op, size in operations:
        if op == REVERSE:
            index = deckSize-1-index
        elif op == CUT and size != 0:
            if size < 0:
                size = abs(size)
                index = (index + size) % deckSize
            else:
                if index < size:
                    index = index+deckSize-size
                else:
                    index -= size
        elif size != 0:
            index = (index * size) % deckSize

    return index

def part1(operations: []) -> int:
    return speedShuffle(operations, 2019, 10007)

def part2(operations: []) -> int:
    return 0

def test(operations: [], deckSize: int):
    deck = deque([i for i in range(0, deckSize)])

    for _ in range(0, 10):
        print(", ".join((deck[c] for c in range(0, 4))))
        deck = reShuffle(operations, deck)

    print(", ".join((deck[c] for c in range(0, 4))))

print("")
print("********************************")
print("* Advent of Code 2019 - Day 22 *")
print("********************************")
print("")

operations = load()

print("Answer part 1 is", part1(operations))
print("Answer part 2 is", part2(operations))

test(operation, 10007)

