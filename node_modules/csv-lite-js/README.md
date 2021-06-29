# csv-lite-js

CSV Library for Browser

## Install

```
$ npm install csv-lite-js
```

## Usage

Simple static method:

```javascript
var CSV = require('csv-lite-js');

// parse CSV string
var txt = "1,2,3\n11,22,33\n111,222,333";
var a = CSV.parse(txt);
console.log(a[0][0]); // 1
console.log(a[1][1]); // 22
```

OOP method:

```javascript
var CSVObject = require('csv-lite-js').CSVObject;

var csv = new CSVObject();
csv.parse("name,age\r\nAki,14\r\nHuyu,20");
console.log(csv.getCell(1,0)); // Aki
console.log(csv.getCell(2,0)); // Huyu
```

## Parse and Stringify

method:

- CSV.parse()
- CSV.stringify()

## Parse CSV from text

```javascript
var csv = "a,b,c\nd,e,f";
var a = CSV.parse(csv);
console.log(a[0][0]); // a
console.log(a[0][1]): // b
console.log(a[1][0]); // d
console.log(a[1][1]): // e
```

## Stringify Array to CSV

```javascript
var a = [[1,2,3],[4,5,6]]
var c = CSV.stringify(a);
console.log(c); // 1,2,3\n4,5,6
```

## TSV (Tab separated value)

```javascript
// set tsv option
CSV.options.delimiter = "\t";

// parse CSV string
var txt = "1\t2\t3\n11\t22\t33\n111\t222\t333";
var a = CSV.parse(txt);
console.log(a[0][0]); // 1
console.log(a[1][1]); // 22
```

## OOP method

- CSVObject.toString()
- CSVObject.parse(csv_str, delimiter)
- CSVObject.getCell(row, col)
- CSVObject.setCell(row, col, value)
- CSVObject.setArray( array )
- CSVObject.getArray()
- CSVObject.find(colNo, keyword, offset)
- CSVObject.findAll(colNo, keyword)
- CSVObject.findAll(colNo, keyword, offset, limit)
- CSVObject.filter(colNo, callback)
- CSVObject.sort(colNo, isAsc)
- CSVObject.sortNumber(colNo, isAsc)
- CSVObject.insertRow(rowNo, rowArray)
- CSVObject.insertCol(colNo, values)
- CSVObject.deleteRow(rowNo)
- CSVObject.deleteCol(colNo)
- CSVObject.add(rowArray)
- CSVObject.length
- CSVObject.useHeader

## Test module

```
$ mocha test/simple.js
```


