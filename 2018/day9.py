from collections import defaultdict

class Node:
    def __init__(self, value):
        self.next  = self
        self.previous = self
        self.value = value

class LinkedList:
    def __init__(self, value):
        self.current = Node(value)
    
    def move(self, steps):
        if steps > 0:
            while steps > 0:
                steps = steps-1
                self.current = self.current.next
        else:
            while steps < 0:
                steps = steps+1
                self.current = self.current.previous

    def insert(self, value):
        node = Node(value)
        node.previous = self.current
        node.next     = self.current.next
        self.current.next.previous = node
        self.current.next  = node
        self.current = node

    def remove(self):
        if self.current.next == self.current:
            raise Exception("Not possible")
        p = self.current.previous
        n = self.current.next
        v = self.current.value
        p.next = n
        n.previous = p
        self.current = n
        return v

def solve(players, max):
    scores  = defaultdict(int)
    marbles = LinkedList(0)
    current = 0

    player  = 0
    percent = -1

    for marble in range(1, max+1):
        if marble % 23 == 0:
            scores[player] += marble
            marbles.move(-7)
            v = marbles.remove()
            scores[player] += v
        else:
            marbles.move(1)
            marbles.insert(marble)

        player = (player + 1) % players

    hiscore = sorted([scores[x] for x in scores])
    hiscore = hiscore[-1]
    return hiscore

def part1(players, max):
    answer = solve(players, max)
    print("Answer part 1 is", answer)

def part2(players, max):
    answer = solve(players, max * 100)
    print("Answer part 2 is", answer)

print("")
print("*******************************")
print("* Advent of Code 2018 - Day 8 *")
print("*******************************")
print("")

print("Test input")

part1(10, 1618)
part1(13, 7999)
part1(17, 1104)
part1(21, 6111)
part1(30, 5807)

print('Real input')

part1(465, 71940)
part2(465, 71940)
