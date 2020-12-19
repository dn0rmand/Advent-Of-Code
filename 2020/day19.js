module.exports = function() 
{
    const DAY = +(__filename.match(/^.*\/day(\d*)\.js$/)[1]);

    class CharacterExpression
    {
        constructor(c)
        {
            this.generate = () => c;
        }
    }

    class SingleRuleExpression
    {
        constructor(id)
        {
            this.generate = rules => rules[id].generate(rules)
        }
    }

    class MultiRulesExpression
    {
        constructor(subRules)
        {
            this.subRules = subRules;
        }

        generate(rules)
        {
            let result = '';

            for(const rule of this.subRules)
            {
                const expression = typeof(rule) === 'number' ? rules[rule] : rule;
                result += expression.generate(rules);
            }

            return result;
        }
    }

    class ComplexRuleExpression
    {
        constructor(subRules)
        {
            this.subRules = subRules.map(r => {
                r = r.trim();
                const innerRules = r.split(' ').map(v => {
                    v = v.trim();
                    if (v[0] === '"')
                        return new CharacterExpression(v[1]);
                    else
                        return new SingleRuleExpression(+v);
                });
                if (innerRules.length > 1)
                    return new MultiRulesExpression(innerRules);
                else
                    return innerRules[0];
            });
        }

        generate(rules)
        {
            const result = [];

            for(const rule of this.subRules)
            {
                let r = rule.generate(rules);
                if (r.length > 1)
                    r = `(${r})`;

                result.push(r);
            }

            const regx = `(${result.join('|')})`;
            return regx;
        }
    }

    class Rule8Expression
    {
        constructor()
        {
            this.generate = rules => `(${rules[42].generate(rules)})+`;
        }
    }

    class Rule11Expression
    {
        constructor()
        {
            this.count = 1;
        }

        generate(rules) 
        {
            const part1 = rules[42].generate(rules);
            const part2 = rules[31].generate(rules);

            if (this.count === 1)
                return `${part1}${part2}`;
            else
                return `(${part1}){${this.count}}(${part2}){${this.count}}`;
        }
    }

    function loadData()
    {
        const readFile = require("advent_tools/readfile");

        const rules = [];
        const messages = [];

        for(const line of readFile(__filename))
        {
            if (line.length === 0)
                continue;

            if (line[0] >= '0' && line[0] <= '9') 
            {
                const [ruleId, syntax] = line.split(':');
                const syntaxes = syntax.split('|').map(v => v.trim());

                let expression;

                if (syntaxes.length > 1) {
                    expression = new ComplexRuleExpression(syntaxes);
                } else if (syntaxes[0][0] === '"') {
                    expression = new CharacterExpression(syntaxes[0][1]);
                } else {                    
                    const ids = syntaxes[0].split(' ').map(i => +i);
                    
                    if (ids.length === 1) {
                        expression = new SingleRuleExpression(+(ids[0]));
                    } else {
                        expression = new MultiRulesExpression(ids);
                    }
                }

                rules[+ruleId] = expression;
            }
            else
            {
                messages.push(line);
            }
        }

        return { rules, messages };
    }

    function part1(input)
    {
        const rule0 = input.rules[0];
        const regx  = rule0.generate(input.rules);
        const expression = new RegExp(`^${regx}$`, 's');

        let total = input.messages.reduce((a, message) => a + expression.test(message), 0);

        return total;
    }

    function part2(input)
    {
        const rule0 = input.rules[0];
        const rule11 = new Rule11Expression();

        input.rules[8] = new Rule8Expression();
        input.rules[11]= rule11;

        let total = 0;
        let messages = input.messages;

        while (messages.length > 0 && rule11.count < 5) // 5 is arbitrary
        {
            const regx  = rule0.generate(input.rules);
            const expression = new RegExp(`^${regx}$`, 's');

            messages = messages.reduce((a, message) => {
                if (expression.test(message)) {
                    total++;
                } else {
                    a.push(message);
                }
                return a;
            }, []);

            rule11.count++;
        }

        return total;
    }

    console.log(`--- Advent of Code day ${DAY} ---`);

    console.time(`${DAY}-load`);
    const input = loadData();
    console.timeEnd(`${DAY}-load`);

    console.time(`${DAY}-part-1`);
    console.log(`Part 1: ${part1(input)}`);
    console.timeLog(`${DAY}-part-1`, `to execute part 1 of day ${DAY}`);

    console.time(`${DAY}-part-2`);
    console.log(`Part 2: ${part2(input)}`);
    console.timeLog(`${DAY}-part-2`, `to execute part 2 of day ${DAY}`);
};
