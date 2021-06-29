// sample for csv-lite

// CSV = require('csv-lite');
var CSV = require('../lib/csv-lite.js');

var a = [
  ["item_id", "item_name", "price"],
  [1000, "Soap-A, N301", 3000],
  [1001, "Soap-B", 400],
  [1002, "Soba-A", 500],
  [1003, "Soba-B", 320]
];


// stringify
var s = CSV.stringify(a);
console.log(s);
