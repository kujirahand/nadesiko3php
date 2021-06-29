// simple read
var CSV = require('../lib/csv-lite.js');
var txt = "1,2,3\n11,22,33\n111,222,333";
var r = CSV.parse(txt);
console.log(JSON.stringify(r));

