from typing import DefaultDict, List
from collections import defaultdict
from time import time

class Section:
    def Empty():
        return Section(None, -1, -3)

    def __init__(self, data:str, start:int, end:int) -> None:
        self.data  = data
        self.start = start
        self.end   = end

    def cut(self, start:int, end:int = None):
        if end == None:
            end = self.end
        return Section(self.data, start, end)

    def isEmpty(self) -> bool:
        return self.start > self.end

class Maze:
    def __init__(self, regex : str) -> None:
        self.directions = {
            'N': [0, -1],
            'S': [0,  1],
            'W': [-1, 0],
            'E': [ 1, 0]
        }
        self.regex = regex
        self.data  = defaultdict(int)
        self.visited = {}

    def splitRegex(self, regex: Section) -> (List[Section], Section):
        start, end = -1, -1
        opened = 0
        datas  = []

        for i in range(regex.start, regex.end+1):
            c = regex.data[i]
            if c == '(':
                opened += 1

            if opened > 0:
                if start < 0:
                    start = i
                end = i
                if c == ')':
                    opened -= 1
                continue

            if c == ')':
                if start < 0:
                    datas.append(None) # empty section
                else:
                    datas.append(regex.cut(start, end))
                out = regex.cut(i+1)
                return datas, out
            elif c == '|':
                datas.append(regex.cut(start, end))
                start = -1
            else:
                if start < 0:
                    start = i
                end = i

        raise Exception("Regex not properly terminated")

    def process(self, x:int, y:int, doors: int, regex: Section, continueWith: Section) -> None:    
        if continueWith == None or continueWith.isEmpty():
            continueWith = Section.Empty()
        if regex == None or regex.isEmpty():
            regex = Section.Empty()        
        # else:
            # print(f"From { regex.start } to { regex.end } or { len(regex.data) }")

        key = (x, y, regex.start, regex.end, continueWith.start, continueWith.end)
        if key in self.visited and self.visited[key] <= doors:
            return # alread done with same or better # of doors

        self.visited[key] = doors

        for i in range(regex.start, regex.end+1):
            c = regex.data[i]
            if c == '(':
                regexes, after = self.splitRegex(regex.cut(i+1))
                for r in regexes:                    
                    self.process(x, y, doors, r, after)
                break
                
            elif c in 'NSWE':
                d = self.directions[c]
                x += d[0]
                y += d[1]
                doors += 1
                pos = (x, y)
                if self.data[pos] > 0:
                    self.data[pos] = min(self.data[pos], doors)
                else:
                    self.data[pos] = doors
            else:
                raise Exception('Invalid Regex')

        if not continueWith.isEmpty():
            self.process(x, y, doors, continueWith, None)

    def build(self) -> None:
        self.process(0, 0, 0, Section(self.regex, 1, len(self.regex)-2), None)

def solve(regex: str) -> int:
    maze = Maze(regex)
    maze.build()
    return maze

def test(regex: str, expected: int) -> None:
    maze = Maze(regex)
    maze.build()
    answer = max((maze.data[k] for k in maze.data))
    assert answer == expected

def part1(maze: Maze) -> None:
    answer = max((maze.data[k] for k in maze.data))
    print("Answer part 1 is", answer)

def part2(maze : Maze) -> None:
    answer = sum((1 for k in maze.data if maze.data[k] >= 1000))
    print("Answer part 2 is", answer)

print("")
print("********************************")
print("* Advent of Code 2018 - Day 20 *")
print("********************************")
print("")

test('^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$', 18)
test('^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$', 23)
test('^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$', 31)

print('Tests passed')
regex = open('2018/data/day20.data').readline().strip()

maze = Maze(regex)
maze.build()

part1(maze)
part2(maze)