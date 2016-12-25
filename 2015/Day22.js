module.exports = function()
{
    const assert = require('assert');
    const clone = require('clone');

    const $effects = [
        { cost:  53, damage: 4, armor: 0, heal: 0, mana:  0, turns: 0 }, // Magic Missile
        { cost:  73, damage: 2, armor: 0, heal: 2, mana:  0, turns: 0 }, // Drain
        { cost: 113, damage: 0, armor: 7, heal: 0, mana:  0, turns: 6 }, // Shield
        { cost: 173, damage: 3, armor: 0, heal: 0, mana:  0, turns: 6 }, // Poison
        { cost: 229, damage: 0, armor: 0, heal: 0, mana:101, turns: 5 }  // Recharge
    ];

    const $boss = {
        points: 71,
        damage: 10
    } ;

    const $player = {
        points: 50,
        mana:   500,
        armor:  0
    } ;

    var cheapest = findCheapestWin();

    console.log("\rCheapest winning configuration cost " + cheapest);

//    var expensive = findMostExpensiveLost();
//    console.log("Most expensive loosing configuration cost " + expensive);

    process.exit(0);

    function findCheapestWin()
    {
        var state = {
            boss:    { points: $boss.points   , damage: $boss.damage },
            player:  { points: $player. points, mana: $player.mana, armor: $player.armor },
            cost:    0,
            effects: []
        };

        var minCost;

        function applyEffect(state, effect)
        {
            state.boss.points  -= effect.damage;
            state.player.armor += effect.armor;
            state.player.points+= effect.heal;
            state.player.mana  += effect.mana;
        }

        function applyEffects(state)
        {
            state.player.armor = 0;

            if (state.boss.points > 0 && state.effects.length > 0)
            {
                newEffects = [];

                state.effects.forEach( (e) => {
                    applyEffect(state, e);

                    e.turns--;
                    if (e.turns > 0)
                        newEffects.push(e);
                });
                
                state.effects = newEffects;
            }
        }

        var count = 0;

        function deepSearch(state, turn)
        {
            count = (count+1)%10;

            if (count == 0 && typeof(global.gc) == "function")
                global.gc();

            // Execute effects

            if (minCost !== undefined && state.cost >= minCost)
                return;

            if (turn == 0) // Player
            {
                state.player.points--;
                if (state.player.points <= 0)
                    return; // Lost
            }
            
            applyEffects(state);
            if (state.boss.points <= 0)
            {                
                console.log("\rPlayer won but spent " + state.cost);
                minCost = state.cost;
                return;
            }

            if (turn == 1) // Boss' turn
            {
                state.player.points -= Math.max((state.boss.damage - state.player.armor), 1);
                if (state.player.points > 0)
                    deepSearch(state, 0);
                else
                    return;
            }
            else // Player's turn
            {
                for(var i = 0; i < $effects.length; i++)
                {
                    var effect   = $effects[i];
                    if (effect.cost > state.player.mana)
                        continue; // To expensive for me

                    // Check if not already active
                    var active = false;
                    state.effects.forEach( (e) => {
                        if (e.cost == effect.cost)
                            active = true;
                    });
                    if (! active) { // We can use it
                        var newState = clone(state);
                        newState.player.mana -= effect.cost;
                        newState.cost        += effect.cost;
                        
                        if (effect.turns == 0) 
                            applyEffect(newState, effect);
                        else
                            newState.effects.push(clone(effect));

                        deepSearch(newState, 1);
                    }
                }
            }
        }

        deepSearch(state, 0);
        return minCost;
    }

    function findMostExpensiveLost()
    {
    }

    function isWinningConfiguration(c)
    {
        var boss = {
            points: 71,
            damage: 10
        } ;

        var player = {
            points: 50,
            mana:   500,
            armor:  0
        } ;

        var turn = 0;
        while (boss.points > 0 && player.points > 0)
        {
            if (turn == 0)
            {
                turn = 1;
                // Player's turn
                var x = player.damage - boss.armor;
                if (x < 1)
                    x = 1;
                boss.points -= x;
            }
            else
            {
                turn = 0;
                // Boss turn
                var x = boss.damage - player.armor;
                if (x < 1)
                    x = 1;
                player.points -= x;
            }
        }
        return player.points > 0;
    }
}