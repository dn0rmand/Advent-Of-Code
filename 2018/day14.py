from time import time

def day14():
    def getDigits(value, minLength):
        digits = [value % 10]
        while value >= 10:
            value = value // 10
            digits.append(value % 10)
        while len(digits) < minLength:
            digits.append(0)
        digits.reverse()
        return digits

    def doStep(e1, e2, recipes, length):
        v = recipes[e1] + recipes[e2]
        if v >= 10:
            recipes[length]   = v // 10
            recipes[length+1] = v - 10
            length += 2
        else:
            recipes[length] = v
            length += 1

        e1 = (e1 + recipes[e1] + 1) % length
        e2 = (e2 + recipes[e2] + 1) % length

        return e1, e2, length

    def dump(e1, e2, recipes):
        s = ""
        for i in range(0, len(recipes)):
            if i == e1:
                s += '(' + str(recipes[i]) + ')'
            elif i == e2:
                s += '[' + str(recipes[i]) + ']'
            else:
                s += ' ' + str(recipes[i]) + ' '
        print(s)

    def initialize(size):
        recipes    = [0] * size
        recipes[0] = 3
        recipes[1] = 7

        return 0, 1, 2, recipes

    def part1(target):
        target     = int(target)

        e1, e2, length, recipes = initialize(target + 20)

        while length <= target+10:
            e1, e2, length = doStep(e1, e2, recipes, length)

        answer = ''.join([str(d) for d in recipes[target:target+10]])
        print("Answer to part 1 is", answer)

    def matches(recipes, start, code):
        for c in code:
            if recipes[start] != c:
                return False
            start += 1

        return True

    def solvePart2(code):
        code = [int(c) for c in code]
        codeLength = len(code)

        e1, e2, length, recipes = initialize(30000000)

        while True:
            e1, e2, length = doStep(e1, e2, recipes, length)
            # dump(e1, e2, recipes)    
            if matches(recipes, length-codeLength, code):
                answer = length - codeLength
                break
            elif matches(recipes, length-codeLength-1, code):
                answer = length - codeLength - 1
                break

        return answer

    def part2(code):
        answer = solvePart2(code)        
        print("Answer to part 2 is", answer)

    print("")
    print("********************************")
    print("* Advent of Code 2018 - Day 14 *")
    print("********************************")
    print("")


    assert solvePart2("51589") == 9
    assert solvePart2("01245") == 5
    assert solvePart2("92510") == 18
    assert solvePart2("59414") == 2018

    INPUT = "909441"

    start = time()
    part1(INPUT)
    end = time()
    print("Part 1 executed in ", round((end-start)*1000), "ms")

    start2 = time()
    part2(INPUT)
    end = time()
    print("Part 2 executed in ", round((end-start2)*1000), "ms")
    print("Total time is", round((end-start)*1000), "ms")