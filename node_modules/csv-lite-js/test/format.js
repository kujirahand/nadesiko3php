// test format
var CSV = require('../');
var CSVObject = CSV.CSVObject;
var assert = require('assert');

describe('format:stringify', function () {
  it('eol', function () {
    var csv = new CSVObject();
    csv.options.eol = "\n";
    csv.setArray([
      ["name", "age"],
      ["Aki", 30],
    ]);
    assert.equal(csv.toString(), "name,age\nAki,30\n");
  });
});

