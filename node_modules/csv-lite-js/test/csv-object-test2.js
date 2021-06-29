// test CSVObject2
var CSV = require('../index.js');
var assert = require('assert');

describe('CSVObject2', function () {
  it('sort', function () {
    //
    var csv = new CSV.CSVObject();
    csv.setArray([
      ["name", "age"],
      ["Nami",  30],
      ["Sanae", 19],
      ["Aki",   17]
    ]);
    csv.useHeader = true;
    csv.sort(0); // order by name
    assert.equal(csv.getCell(1,0), "Aki");
    assert.equal(csv.getCell(2,0), "Nami");
    assert.equal(csv.getCell(3,0), "Sanae");
    //
    csv.sort(1); // order by age ASC
    assert.equal(csv.getCell(1,0), "Aki");
    assert.equal(csv.getCell(2,0), "Sanae");
    assert.equal(csv.getCell(3,0), "Nami"); 
  });

  it('sort2', function () {
    //
    var csv = new CSV.CSVObject();
    csv.parse("name,rank,age\nHaru,A,22\nNatu,B,23\nAki,C,9\n");
    csv.useHeader = true;
    csv.sort(1, false); // order by rank DESC
    assert.equal(csv.getCell(1,0), "Aki");
    assert.equal(csv.getCell(2,0), "Natu");
    assert.equal(csv.getCell(3,0), "Haru");
  });

  it('sort3', function () {
    //
    var csv = new CSV.CSVObject();
    csv.parse("name,rank,age\nHaru,A,22\nNatu,B,23\nAki,C,9\n");
    csv.useHeader = true;
    //
    csv.sort(2); // order by age ASC
    assert.equal(csv.getCell(1,0), "Aki");
    assert.equal(csv.getCell(2,0), "Haru");
    assert.equal(csv.getCell(3,0), "Natu"); 
  });

  it('sortNumber', function () {
    //
    var csv = new CSV.CSVObject();
    csv.setArray([
      ["name", "age"],
      ["Nami",  "30"],
      ["Sanae", "19"],
      ["Aki",   "17"]
    ]);
    csv.useHeader = true;
    csv.sortNumber(1, false); // order by age DESC
    assert.equal(csv.getCell(1,0), "Nami"); 
    assert.equal(csv.getCell(2,0), "Sanae");
    assert.equal(csv.getCell(3,0), "Aki");
  });

  it('insertCol', function () {
    var csv = new CSV.CSVObject();
    csv.setArray([
      ["name", "age"],
      ["Nami", 30],
      ["Aki",  12],
      ["Huyu", 17]
    ]);
    // insert
    csv.insertCol(1, [
      "level", 3, 5, 2
    ]);
    // sort by level
    csv.useHeader = true;
    csv.sort(1);
    //
    assert.equal(csv.getCell(1,0), "Huyu");
    assert.equal(csv.getCell(2,0), "Nami");
    assert.equal(csv.getCell(3,0), "Aki");
  });
  it('insertCol', function () {
    var csv = new CSV.CSVObject();
    csv.setArray([
      ["name", "age", "rank"],
      ["Nami", 30, 1],
      ["Aki",  20, 2],
      ["Huyu", 10, 3]
    ]);
    // delete
    csv.deleteCol(1);
    // sort by rank
    csv.useHeader = true;
    csv.sort(1);
    //
    assert.equal(csv.getCell(1,0), "Nami");
    assert.equal(csv.getCell(2,0), "Aki");
    assert.equal(csv.getCell(3,0), "Huyu");
  });
  it('getColValues', function () {
    var csv = new CSV.CSVObject();
    csv.setArray([
      ["name", "age", "rank"],
      ["Nami", 30, 1],
      ["Aki",  20, 2],
      ["Huyu", 10, 3]
    ]);
    var ranks = csv.getColValues(2);
    assert.equal(ranks.join(":"), "rank:1:2:3");
  });

});



