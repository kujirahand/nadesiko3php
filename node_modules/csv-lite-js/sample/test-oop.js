//
var CSVObject = require('../').CSVObject;

var csv = new CSVObject();
csv.parse("name,age\r\nAki,14\r\nHuyu,20");
console.log(csv.getCell(1,0)); // Aki
console.log(csv.getCell(2,0)); // Huyu
