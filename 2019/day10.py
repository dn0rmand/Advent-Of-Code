import math

def loadMap() -> []:
    map = []
    with open('2019/data/day10.data', 'rt') as file:
        line = [c for c in file.readline().rstrip('\n')]
        while line:
            map.append(line)
            line = [c for c in file.readline().rstrip('\n')]

    return map

def getAsteroidInSight(map: [], x: int, y: int, ox: int, oy: int) -> (int, int):
    HEIGHT = len(map)
    WIDTH  = len(map[0])

    x += ox
    y += oy
    while x >= 0 and x < WIDTH and y >= 0 and y < HEIGHT:
        if not map[y][x] == '.':
            return (x, y)

        x += ox
        y += oy

    return None

def getAsteroidsInSight(map: [], x: int, y: int):
    HEIGHT = len(map)
    WIDTH  = len(map[0])

    for ox in range(0, WIDTH):
        for oy in range(0, HEIGHT):
            if ox == 0 and oy == 0:
                continue
            if math.gcd(ox, oy) == 1:
                r = getAsteroidInSight(map, x, y, ox, oy)
                if not r == None:
                    yield (r[0], r[1], ox, oy, 1)

                if ox > 0:
                    r = getAsteroidInSight(map, x, y, -ox, oy)
                    if not r == None:
                        yield (r[0], r[1], ox, oy, 2)

                if oy > 0:
                    r = getAsteroidInSight(map, x, y, ox, -oy)
                    if not r == None:
                        yield (r[0], r[1], ox, oy, 0)

                if oy > 0 and ox > 0:
                    r = getAsteroidInSight(map, x, y, -ox, -oy)
                    if not r == None:
                        yield (r[0], r[1], ox, oy, 3)

def part1(map: []) -> int:
    HEIGHT = len(map)
    WIDTH  = len(map[0])

    best = (0, -1, -1)

    for x in range(0, HEIGHT):
        for y in range(0, WIDTH):
            if map[y][x] == '.':
                continue
            v = len([a for a in getAsteroidsInSight(map, x, y)])
            if v > best[0]:
                best = (v, x, y)

    return best

def part2(map : [], centerX: int, centerY: int) -> int:
    def makeKey(asteroid):
        _,_,ox, oy, q = asteroid
        key = q * 10000
        if q == 0:
            key += (ox / oy)

        elif q == 1:
            if not ox == 0:
                key += (oy / ox)
            else:
                key += 9000

        elif q == 2:
            if not oy == 0:
                key += (ox / oy)
            else:
                key += 9000

        elif q == 3:
            key += 5000 - (ox / oy)

        return key

    count = 0
    asnwer = 0
    while count < 200:
        asteroids = [a for a in getAsteroidsInSight(map, centerX, centerY)]
        ast = sorted(asteroids, key=makeKey)
        for a in ast:
            count += 1
            x,y,ox,oy,q = a
            print(f"{count}: {x*100+y}")
            if count == 200:
                answer = x*100 + y
                break
            map[y][x] = '.'

    return answer

print("")
print("********************************")
print("* Advent of Code 2019 - Day 10 *")
print("********************************")
print("")

map = loadMap()

count, x, y = part1(map)
# count, x, y = 210, 11,13

print("Answer part 1 is", count)
print("Answer part 2 is", part2(map, x, y))

print("")

"""
1: 1112
2: 1201
3: 1202
4: 1204
5: 1205
6: 1206
7: 1300
8: 1207
9: 1302
10: 1208
11: 1400
12: 1305
13: 1402
14: 1306
15: 1403
16: 1500
17: 1404
18: 1502
19: 1405
20: 1600
21: 1308
22: 1406
23: 1504
24: 1602
25: 1700
26: 1407
27: 1800
28: 1702
29: 1604
30: 1506
31: 1801
32: 1408
33: 1900
34: 1605
35: 1310
36: 1803
37: 1606
38: 1902
39: 1409
40: 1804
41: 1508
42: 1607
43: 1706
44: 1805
45: 1904
46: 1212
47: 1906
48: 1807
49: 1708
50: 1609
51: 1510
52: 1808
53: 1709
54: 1908
55: 1610
56: 1312
57: 1810
58: 1611
59: 1910
60: 1412
61: 1512
62: 1712
63: 1812
64: 1912
65: 1213
66: 1914
67: 1814
68: 1714
69: 1614
70: 1514
71: 1815
72: 1414
73: 1916
74: 1615
75: 1816
76: 1314
77: 1817
78: 1616
79: 1918
80: 1415
81: 1818
82: 1516
83: 1718
84: 1819
85: 1315
86: 1518
87: 1417
88: 1519
89: 1418
90: 1215
91: 1318
92: 1216
93: 1217
94: 1218
95: 1219
96: 1114
97: 1019
98: 1018
99: 1017
100: 1016
101: 918
102: 1015
103: 818
104: 719
105: 817
106: 718
107: 1014
108: 419
109: 617
110: 716
111: 418
112: 815
113: 119
114: 218
115: 19
116: 914
117: 18
118: 416
119: 615
120: 814
121: 415
122: 714
123: 215
124: 614
125: 514
126: 414
127: 314
128: 214
129: 14
130: 1013
131: 112
132: 212
133: 312
134: 412
135: 512
136: 11
137: 111
138: 211
139: 311
140: 812
141: 9
142: 310
143: 611
144: 410
145: 209
146: 8
147: 510
148: 7
149: 409
150: 610
151: 308
152: 6
153: 811
154: 106
155: 408
156: 710
157: 206
158: 609
159: 4
160: 508
161: 407
162: 306
163: 205
164: 104
165: 1012
166: 1
167: 102
168: 203
169: 304
170: 405
171: 506
172: 101
173: 708
174: 404
175: 100
176: 505
177: 302
178: 606
179: 301
180: 402
181: 605
182: 808
183: 401
184: 706
185: 604
186: 502
187: 400
188: 1011
189: 500
190: 602
191: 704
192: 806
193: 601
194: 908
195: 702
196: 1010
197: 700
198: 803
199: 906
200: 802
"""