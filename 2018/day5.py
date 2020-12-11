from collections import Counter

def day5():
    def loadData():
        with open('2018/data/day5.data', 'rt') as data:
            return data.readline().strip()

    def shouldRemove(a, b):
        if a is None:
            return False

        return a != b and (a == b.upper() or a == b.lower())

    def reducePolymer(polymer):
        result = []
        a = None
        for b in polymer:            
            if a is None:
                a = b
            elif shouldRemove(a, b):            
                a = None
                modified = True
            else:
                if len(result) > 0:
                    last = result[-1]  
                else:
                    last = None

                if shouldRemove(last, a):
                    result.pop()
                else:
                    result.append(a)
                a = b

        answer = len(result)
        if not a is None:
            answer += 1

        return answer

    def part1(polymer):
        answer = reducePolymer(polymer)     
        print("Answer part 1 is", answer)

    def part2(polymer):
        letters = set([c.upper() for c in polymer])
        counts  = []  
        for letter in letters:
            newPolymer = [c for c in polymer if c.upper() != letter]
            count = reducePolymer(newPolymer)
            counts.append(count)

        answer = min(counts)
        print("Answer part 2 is", answer)

    print("")
    print("*******************************")
    print("* Advent of Code 2018 - Day 5 *")
    print("*******************************")
    print("")

    input = loadData()
    part1(input)
    part2(input)

    print("")