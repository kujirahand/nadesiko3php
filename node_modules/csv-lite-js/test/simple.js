// test
var CSV = require('../lib/csv-lite');
var assert = require('assert');

describe('stringify', function () {
  var txt = CSV.stringify([
    [1,2,3],
    [4,5,6]
  ]);
  it('simple', function () {
    assert.equal(txt, "1,2,3\r\n4,5,6\r\n");
  });

  it('value in comma', function () {
    var a = [
      ['name', 'age'],
      ['Daniel,K', 30],
    ];
    var csv = CSV.stringify(a);
    assert.equal(csv, "name,age\r\n\"Daniel,K\",30\r\n");
  });
  it('value in CRLF', function () {
    var a = [
      ['name', 'age'],
      ["aaa\r\nbbb", 30],
    ];
    var csv = CSV.stringify(a);
    assert.equal(csv, "name,age\r\n\"aaa\r\nbbb\",30\r\n");
  });
  it('value in CRLF', function () {
    var a = [
      ['name', 'age'],
      ["aaa\nbbb", 30],
    ];
    var csv = CSV.stringify(a);
    assert.equal(csv, "name,age\r\n\"aaa\r\nbbb\",30\r\n");
  });
});

describe('parse CSV', function () {
  it('simple csv', function () {
    var a = CSV.parse("a,b,c\nd,e,f\ng,h,i\n");
    assert.equal(a[0][0], 'a');
    assert.equal(a[0][1], 'b');
    assert.equal(a[1][0], 'd');
    assert.equal(a[2][2], 'i');
  });
  it('double quot1', function () {
    var b = CSV.parse("\"a,a,a\",\"b,b,b\"\na,b");
    assert.equal(b[0][0], 'a,a,a');
    assert.equal(b[0][1], 'b,b,b');
    assert.equal(b[1][1], 'b');
  });
  it('double quot2', function () {
    var c = CSV.parse("\"aa\"\"aa\",\"bb\",\"cc\"");
    assert.equal(c[0][0], 'aa"aa');
    assert.equal(c[0][1], 'bb');
    assert.equal(c[0][2], 'cc');
  });
  it('double quot3', function () {
    var d = CSV.parse("\"aa\"\"aa\",\"bb\",\"cc\"\n\"1\",\"2\",\"3\"");
    assert.equal(d[1][0], '1');
    assert.equal(d[1][1], '2');
    assert.equal(d[1][2], '3');
  });
  it('blank cell', function () {
    var d = CSV.parse('1,,3,4\n5,6,7,8');
    assert.equal(d[0][0], '1');
    assert.equal(d[0][1], '');
    assert.equal(d[0][2], '3');
    assert.equal(d[0][3], '4');
    assert.equal(d[1][0], '5');
  });

  it('Dialect of Excel', () => {
    const d = CSV.parse('"1",="0120=444=444=",=3,4\n5,6,7,8')
    assert.equal(d[0][0], '1');
    assert.equal(d[0][1], '0120=444=444=');
    assert.equal(d[0][2], '=3');
    assert.equal(d[0][3], '4');
    assert.equal(d[1][0], '5');
  });
});

describe('parse TSV', function () {
  it('simple tsv', function () {
    CSV.options.delimiter = "\t";
    var a = CSV.parse("aaa\tbbb\tccc\nddd\teee\tfff");
    assert.equal(a[0][0], "aaa");
    assert.equal(a[1][0], "ddd");
    assert.equal(a[1][1], "eee");
  });
  it('tsv with comma', function () {
    var tsv = "a,b,c\td,e,f\ng,h,i\tj,k,l\no\tp\tq";
    var a = CSV.parse(tsv, "\t");
    assert.equal(a[0][0], "a,b,c");
    assert.equal(a[1][0], "g,h,i");
    assert.equal(a[1][1], "j,k,l");
    assert.equal(a[2][2], "q");
  });
  it('tsv blank cell', function () {
    var tsv = "1\t\t3\n4\t5\t6";
    var a = CSV.parse(tsv, "\t");
    assert.equal(a[0][0], "1");
    assert.equal(a[0][1], "");
    assert.equal(a[0][2], "3");
    assert.equal(a[1][0], "4");
  });

  it('Dialect of Excel', () => {
    const d = CSV.parse('"1"\t="0120=444=444="\t=3\t4\n5\t6\t7\t8', '\t')
    assert.equal(d[0][0], '1');
    assert.equal(d[0][1], '0120=444=444=');
    assert.equal(d[0][2], '=3');
    assert.equal(d[0][3], '4');
    assert.equal(d[1][0], '5');
  });
});

describe('parse test', function () {
  it('end of line bug(#7)', () => {
    const d = CSV.parse('a,b,c\nd, e, f,\ng, h, i\n', ',');
    assert.equal(d[1][0], 'd');
    assert.equal(d[1][1], 'e');
    assert.equal(d[1][2], 'f');
    assert.equal(d[2][0], 'g');
    assert.equal(d[2][1], 'h');
    assert.equal(d[2][2], 'i');
    
    const e = CSV.parse('aa, bb, cc,\ndd, ee, ff,\n', ',');
    assert.equal(e[1][0], 'dd');
    assert.equal(e[1][1], 'ee');

    const f = CSV.parse('aa, "bb\nbb", "cc",\ndd, ee, ff,\n', ',');
    assert.equal(f[1][0], 'dd');
    assert.equal(f[1][1], 'ee');
  });
});

