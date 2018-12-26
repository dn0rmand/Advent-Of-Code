from typing import NamedTuple, List, DefaultDict
from collections import defaultdict
from parse import parse
from enum import Enum

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

    def powerLevel(self) -> int:
        return self.power * self.count

    def __hash__(self) -> int:
        return self.initiative

    def getDamage(self, attacker) -> int:
        power = attacker.power * attacker.count
        if attacker.attack in self.immunities:
            return 0
        if attacker.attack in self.weaknesses:
            power *= 2
        return power

    def applyDamage(self, attacker) -> None:
        killed = self.getDamage(attacker) // self.hitPoints
        self.count -= killed
        if self.count < 0:
            self.count = 0

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

    type: UnitType = None

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

    return units

def selectTargets(units: List[Units]) -> DefaultDict[Units, Units]:
    targets = defaultdict(Units)
    selected= []

    order = sorted(units, key=lambda u: (u.powerLevel(), u.initiative), reverse=True)

    for unit in order:
        enemies = [u for u in units if u.type != unit.type and not u in selected]
        best   = None
        damage = 0

        for e in enemies:
            d = e.getDamage(unit)
            if d > damage:
                best = e
                damage = d
            elif d > 0 and d == damage:
                if e.powerLevel() > best.powerLevel():
                    best = e
                elif e.powerLevel() == best.powerLevel() and e.initiative > best.initiative:
                    best = e

        if damage > 0:
            selected.append(best)
            targets[unit] = best

    # print(*[u.initiative for u in selected])
    return targets

def performAttack(units: List[Units], selection: DefaultDict[Units, Units]) -> None:

    order = sorted(units, key=lambda u: u.initiative, reverse=True)
    wasAttacked = set()

    for attacker in order:
        if attacker.count > 0 and attacker in selection:
            attackee = selection[attacker]
            if attackee in wasAttacked:
                raise Exception("Cannot be attacked twice")

            o = attackee.count
            attackee.applyDamage(attacker)
            # print(attacker.initiative,':',attacker.type, '->' , attackee.initiative,':',attackee.type, ' => ', (o-attackee.count), 'killed')
            wasAttacked.add(attackee)

def doWar(boost: int) -> List[Units]:
    units = loadData()

    for u in units:
        if u.type == UnitType.Immune:
            u.power += boost

    total = sum((u.count for u in units))
    while True:
        infections = sum((1 for u in units if u.type == UnitType.Infection and u.count > 0))
        immunes    = sum((1 for u in units if u.type == UnitType.Immune and u.count > 0))
        if infections == 0 or immunes == 0:
            break

        targets = selectTargets(units)        
        if len(targets) == 0:
            return []

        performAttack(units, targets)
        units = [u for u in units if u.count > 0]
        newTotal = sum((u.count for u in units))
        if total == newTotal:
            return []
        total = newTotal

    return units

def part1() -> None:
    units = doWar(0)
    if not units:
        raise Exception("Stuck")
    answer = sum((u.count for u in units))
    print("Answer to part 1 is", answer)

def part2() -> None:

    boost = 0
    while True:
        boost += 1
        units = doWar(boost)
        print(boost)
        answer = sum((u.count for u in units if u.type == UnitType.Immune))
        if answer > 0:
            break

    print("Answer to part 2 is", answer, 'Boost of', boost)

print("")
print("********************************")
print("* Advent of Code 2018 - Day 24 *")
print("********************************")
print("")

part1()
part2()
