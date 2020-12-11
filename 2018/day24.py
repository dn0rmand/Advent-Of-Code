from typing import NamedTuple, List, DefaultDict
from collections import defaultdict
from parse import *
from enum import Enum
from time import time

def day24():
    class Attack(Enum):
        Bludgeoning=1
        Slashing=2
        Cold=3
        Radiation=4
        Fire=5

    class UnitType(Enum):
        Immune = 1
        Infection = 2

    class Units:
        def __init__(self, type:UnitType, initiative: int, count:int, hitPoints:int, attack: Attack, power:int) -> None:
            self.type       = type
            self.initiative = initiative
            self.count      = count
            self.hitPoints  = hitPoints
            self.attack     = attack
            self.power      = power
            self.weaknesses = []
            self.immunities = []
            self._count     = count
            self._power     = power
        
        def reset(self, boost: int) -> None:
            self.count = self._count
            if self.type == UnitType.Immune:
                self.power = self._power+boost
            else:
                self.power = self._power

        def powerLevel(self) -> int:
            return self.power * self.count

        def __hash__(self) -> int:
            return self.initiative

        def getDamage(self, attacker) -> int:
            power = attacker.powerLevel()
            if attacker.attack in self.immunities:
                return 0
            if attacker.attack in self.weaknesses:
                power *= 2
            return power

        def applyDamage(self, attacker) -> int:
            if self.count == 0:
                return 0

            killed = self.getDamage(attacker) // self.hitPoints
            self.count -= killed
            if self.count < 0:
                self.count = 0
            return killed

    def loadData() -> List[Units]:

        def toAttack(word: str) -> Attack:
            if word == "bludgeoning":
                return Attack.Bludgeoning
            elif word == "cold":
                return Attack.Cold
            elif word == "slashing":
                return Attack.Slashing
            elif word == "radiation":
                return Attack.Radiation
            elif word == "fire":
                return Attack.Fire
            else:
                raise Exception("Invalid Attack name")

        units = []

        type = None

        for line in open('2018/data/day24.data').readlines():
            line = line.strip()

            if line == "Immune System:":
                type = UnitType.Immune
            elif line == "Infection:":
                type = UnitType.Infection
            elif line:
                wi   = ""
                s    = line.find('(')

                weaknesses = []
                immunities = []

                if s >= 0:
                    e = line.find(')', s)
                    if e >= 0:
                        wi   = line[s+1:e].strip()
                        line = line[:s].strip() + ' ' + line[e+1:].strip()
                    else:
                        wi   = line[s+1:].strip()
                        line = line[:s].strip()
                if wi:
                    target = weaknesses
                    for w in wi.replace(';', '').replace(',','').split():
                        if w == "weak":
                            target = weaknesses
                        elif w == "immune":
                            target = immunities
                        elif w != "to":
                            a = toAttack(w)
                            target.append(a)

                p = parse("{:d} units each with {:d} hit points with an attack that does {:d} {:w} damage at initiative {:d}", line)
                count, hitPoints, power, attack, initiative = p
                attack = toAttack(attack)
                u = Units(type=type, initiative=initiative, count=count, hitPoints=hitPoints, attack=attack, power=power)
                u.weaknesses = weaknesses
                u.immunities = immunities
                units.append(u)

        return sorted(units, key=lambda u: u.initiative, reverse=True)

    def selectTargets(units: List[Units]) -> DefaultDict[Units, Units]:
        targets = defaultdict(Units)
        selected= []

        order = sorted(units, key=lambda u: (u.powerLevel(), u.initiative), reverse=True)

        for unit in order:
            enemies = sorted([(u.getDamage(unit), u.powerLevel(), u.initiative, u) for u in units if u.type != unit.type and not u in selected])

            if enemies and enemies[-1][0] > 0:
                best = enemies[-1][3]
                selected.append(best)
                targets[unit] = best

        return targets

    def performAttack(units: List[Units], selection: DefaultDict[Units, Units]) -> None:
        killed = sum((selection[u].applyDamage(u) for u in units if u.count > 0 and u in selection))
        return killed

    def doWar(units: List[Units], boost: int) -> List[Units]:
        for u in units:
            u.reset(boost)

        while True:
            immunes = sum((1 for u in units if u.type == UnitType.Immune))
            if immunes == 0:
                break
            infections = sum((1 for u in units if u.type == UnitType.Infection))
            if infections == 0:
                break

            targets = selectTargets(units)
            if not targets:
                return []

            if performAttack(units, targets) == 0:
                return []

            units = [u for u in units if u.count > 0]

        return units

    def logTime(func):
        def wrapper(units: List[Units] = None) -> None:
            start = time()
            if units == None:
                func()
            else:
                func(units)
            end = time()
            print(func.__name__, "executed in ", end-start)
            print('')
        return wrapper

    @logTime
    def part1(units: List[Units]) -> None:
        units = doWar(units, 0)
        if not units:
            raise Exception("Stuck")
        answer = sum((u.count for u in units))
        print("Answer to part 1 is", answer)

    @logTime
    def part2(units: List[Units]) -> None:

        boost = 0

        # go up fast

        while True:
            boost += 10
            us = doWar(units, boost)
            answer = sum((u.count for u in us if u.type == UnitType.Immune))
            if answer > 0:
                break

        # go down slowly

        while True:
            us = doWar(units, boost-1)
            value = sum((u.count for u in us if u.type == UnitType.Immune))
            if value <= 0:
                break
            else:
                answer = value
                boost -= 1

        print("Answer to part 2 is", answer, 'with a boost of', boost)

    print("")
    print("********************************")
    print("* Advent of Code 2018 - Day 24 *")
    print("********************************")
    print("")


    @logTime
    def solve() -> None :
        units = loadData()
        part1(units)
        part2(units)

    solve()
