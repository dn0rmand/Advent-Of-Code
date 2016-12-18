var days = [
    function() { console.log('not a valid day'); },

    require("./Day01.js"),//1
    require("./Day02.js"),//2
    require("./Day03.js"),//3
    require("./Day04.js"),//4
    require("./Day05.js"),//5
    require("./Day06.js"),//6
    require("./Day07.js"),//7
    require("./Day08.js"),//8
    require("./Day09.js"),//9
    require("./Day10.js"),//10
    require("./Day11.js"),//11
    require("./Day12.js"),//12
    require("./Day13.js"),//13
    require("./Day14.js"),//14
    require("./Day15.js"),//15
    require("./Day16.js"),//16
    require("./Day17.js"),//17
    require("./Day18.js"),//18
];

var day = 18;

console.log("Running Day "+day+" puzzle");
days[day++]();
