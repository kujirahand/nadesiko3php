// test CSVObject
var CSV = require('../index.js');
var assert = require('assert');

describe('CSVObject', function () {
  it('set/get', function () {
    var csv = new CSV.CSVObject();
    csv.setCell(3,0, 'hoge');
    csv.setCell(3,1, 33);
    csv.setCell(2,0, 'fuga');
    csv.setCell(2,1, 22);
    csv.setCell(1,0, 'misia');
    csv.setCell(1,1, 11);
    csv.setCell(0,0, 'singer');
    csv.setCell(0,1, 'price');
    //
    assert.equal(csv.getCell(1,0), 'misia');
    assert.equal(csv.getCell(3,0), 'hoge');
    assert.equal(csv.length, 4);
  });

  //
  it('filter', function () {
    var csv = new CSV.CSVObject();
    csv.setArray([
      ['name', 'age'],
      ['Daniel', 30],
      ['Joseph', 25],
      ['David', 22],
      ['John', 15],
    ]);
    // pickup age <= 22
    var n = csv.filter(1, function(v) { return (v <= 22); });
    assert.equal(n.length, 2);
    var m = csv.filter(0, function(v) { return v == 'Daniel'; });
    assert.equal(m[0][0], 'Daniel');
    assert.equal(m[0][1], 30);
  });
  it('findAll', function () {
    var csv = new CSV.CSVObject();
    csv.setArray([
      ['name', 'size'],
      ['Nami', 'M'],
      ['Sanji', 'L'],
      ['Zoro', 'L']
    ]);
    var res = csv.findAll(1, 'L');
    assert.equal(res.length, 2);
    assert.equal(res[0][0], 'Sanji');
    assert.equal(res[1][0], 'Zoro');
  });
});



