def day25():
    def loadData():
        points = []
        for line in open('2018/data/day25.data').readlines():
            line = line.strip().split(',')
            a, b, c, d = int(line[0]), int(line[1]), int(line[2]), int(line[3])
            points.append((a, b, c, d))

        return points

    def distance(p1, p2):
        d = abs(p1[0] - p2[0]) + abs(p1[1] - p2[1]) + abs(p1[2] - p2[2]) + abs(p1[3] - p2[3])
        return d

    def part1(points):
        connections = {}
        constellations = {}
        
        def trimConstellations(constellation, children):
            for c in children:
                if c in constellation:
                    continue

                constellation.append(c)
                if c in constellations:
                    constellations.pop(c)
                trimConstellations(constellation, connections[c])

        for i, p1 in enumerate(points):
            constellations[p1] = [p1]
            connections[p1] = [ p2 for p2 in points if p1 != p2 and distance(p1, p2) <= 3 ]

        for p in points:
            if p in constellations:
                constellation = constellations[p]
                trimConstellations(constellation, connections[p])
            
        answer = len(constellations)

        print("Answer to part 1 is", answer)

    def part2(points):
        print("No part 2 for day 25")

    print("")
    print("********************************")
    print("* Advent of Code 2018 - Day 25 *")
    print("********************************")
    print("")

    points = loadData()

    part1(points)
    part2(points)
