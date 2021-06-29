// test-read.js
var CSV = require('../lib/csv-lite.js');
var txt = "1,2,3\n" +
  "\"4\",\"5,5,5\",666\n" +
  "aa,bb,cc,\"dd\"\"d\"\n" +
  "a,b,c";
var a = CSV.parse(txt);
console.log(a);


