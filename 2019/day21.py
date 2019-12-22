from IntCode import IntCode

def part1(program: IntCode) -> int:
    damage = 0

    solution = [
        "NOT C J",  # hole at C
        "AND D J",  # and ground at D
        # always jump if no ground right in front
        "NOT A T",
        "OR T J"
    ]

    def input():
        for l in solution:
            if len(l) == 0:
                continue
            for c in l:
                yield ord(c)
            yield 10
        for c in "WALK":
            yield ord(c)
        yield 10

    def output(code: int) -> None:
        nonlocal damage

        if code > 255:
            damage = code
        # elif code == 10:
        #     print("")
        # else:
        #     print(chr(code), end="")

    program.initialize(input(), output)
    program.execute(False)

    return damage

def solve(prgram: IntCode, length: int) -> int:

    solution: [str] = []
    traceCount = 0

    def test() -> int:

        # solution = [
        #     "NOT A J",
        #     "NOT C T",
        #     "AND H T",
        #     "OR T J",
        #     "NOT B T",
        #     "AND A T",
        #     "AND C T",
        #     "OR T J",
        #     "AND D J"
        # ]

        damage  = 0

        nonlocal traceCount

        def input():
            nonlocal started

            for l in solution:
                if len(l) == 0:
                    continue
                for c in l:
                    yield ord(c)
                yield 10
            for c in "RUN":
                yield ord(c)
            yield 10

        started = 0
        def output(code: int) -> None:
            nonlocal damage, started

            if code > 255:
                damage = code
                program.ip = -1
            elif started > 3:
                program.ip = -1
            elif code == 10:
                started += 1

        if (traceCount % 1000) == 0:
            print(f"\r{traceCount}", end=" - ")
            for s in solution:
                print(f"{s}", end=", ")
            print("   ", end="")
        traceCount += 1

        program.initialize(input(), output)
        program.execute(False)
        # if damage != 0:
        #     for s in solution:
        #         print(s)

        return damage

    visited = set()

    def inner() -> int:

        if len(solution) == length:
            return test()

        ops1 = ['NOT', 'AND', 'OR']
        ops2 = ['NOT']

        for op in ['NOT', 'AND', 'OR']:
            for destin in ['J', 'T']:
                for source in ['A','B','C','D','E','F','G','H','I','J','T']:
                    if op != 'NOT' and source == destin:
                        continue

                    s = f"{op} {source} {destin}"

                    if len(solution) > 0 and solution[-1] == s:
                        continue

                    if source not in ['J', 'T'] and s in solution:
                        continue

                    solution.append(s)
                    damage = inner()
                    if damage != 0:
                        return damage
                    solution.pop()

        return 0

    return inner()

def part2(program: IntCode) -> int:

    damage = solve(program, 9)
    print("")
    return damage

print("")
print("********************************")
print("* Advent of Code 2019 - Day 21 *")
print("********************************")
print("")

program = IntCode('2019/data/day21.data')

print("Answer part 1 is", part1(program))
print("Answer part 2 is", part2(program))

