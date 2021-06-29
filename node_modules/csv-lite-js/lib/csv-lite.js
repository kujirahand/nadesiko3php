// csv-lite.js --- for Browser
'use strict';
var options = {
  delimiter: ',',
  eol: "\r\n"
};

function parse(txt, delimiter) {
  // delimiter
  if (delimiter == undefined) {
    delimiter = options.delimiter;
  }
  // check txt
  txt = "" + txt + "\n";
  // convert CRLF to LF, and CR to LF
  txt = txt.replace(/(\r\n|\r)/g, "\n");
  // trim right
  txt = txt.replace(/\s+$/, '')+"\n";
  // set pattern
  var patToDelim = "^(.*?)([\\"+delimiter+"\\n])";
  var reToDelim = new RegExp(patToDelim);
  // if value is number then convert to float
  var convType = function (v) {
    if (typeof(v) == 'string') {
      if (v.search(/^[0-9\.]+$/) >= 0) {
        v = parseFloat(v); // convert number
      }
    }
    return v;
  };
  // parse txt
  var res = [], cells = [], c = ''
  while (txt != "") {
    // first check delimiter (because /^\s+/ skip delimiter'\t') (#3)
    c = txt.charAt(0);
    if (c === delimiter) {
      txt = txt.substr(1)
      cells.push('');
      continue;
    }
    // second check LF (#7)
    if (c === "\n") {
      cells.push('');
      res.push(cells);
      cells = [];
      txt = txt.substr(1);
      continue;
    }
    
    // trim white space
    txt = txt.replace(/^\s+/, "");
    c = txt.charAt(0);

    // no data
    if (c === delimiter) {
      console.log("delimiter");
      cells.push('');
      txt = txt.substr(delimiter.length);
      continue;
    }

    // written using the dialect of Excel
    if (c === '=' && txt.charAt(1) === '"') {
      txt = txt.substr(1);
      continue;
    }

    // number or simple string
    if (c !== '"') { // number or simple str
      var m = reToDelim.exec(txt);
      if (!m) {
        cells.push(convType(txt));
        res.push(cells);
        cells = [];
        break;
      }
      if (m[2] == "\n") {
        cells.push(convType(m[1]));
        res.push(cells);
        cells = [];
      } else if (m[2] == delimiter) {
        cells.push(convType(m[1]));
      }
      txt = txt.substr(m[0].length);
      continue;
    }
    // "" ... blank data
    if (txt.substr(0, 2) == '""') {
      cells.push('');
      txt = txt.substr(2);
      continue;
    }
    // "..."
    var i = 1, s = "";
    while (i < txt.length) {
      var c1 = txt.charAt(i);
      var c2 = txt.charAt(i + 1);
      // console.log("@" + c1 + c2);
      // 2quote => 1quote char
      if (c1 == '"' && c2 == '"') {
        i += 2;
        s += '"';
        continue;
      }
      if (c1 == '"') {
        i++;
        if (c2 == delimiter) {
          i++;
          cells.push(convType(s));
          s = '';
          break;
        }
        if (c2 == "\n") {
          i++;
          cells.push(convType(s));
          res.push(cells);
          cells = [];
          break;
        }
        // if (c2 == " " || c2 == "\t") {
        i++;
        continue;
      }
      s += c1;
      i++;
    }
    txt = txt.substr(i);
  }
  if (cells.length > 0) res.push(cells);
  return res;
}

function stringify(ary, delimiter, eol) {
  // check arguments
  if (delimiter == undefined) {
    delimiter = options.delimiter;
  }
  if (eol == undefined) {
    eol = options.eol;
  }
  var valueConv = genValueConverter(delimiter, eol);
  if (ary == undefined) return "";
  var r = "";
  for (var i = 0; i < ary.length; i++) {
    var cells = ary[i];
    if (cells == undefined) {
      r += eol; continue;
    }
    for (var j = 0; j < cells.length; j++) {
      cells[j] = valueConv(cells[j]);
    }
    r += cells.join(delimiter) + eol;
  }
  // replace return code
  r = r.replace(/(\r\n|\r|\n)/g, eol)
  return r;
}

function genValueConverter(delimiter, eol) {
  return (function(s) {
    s = "" + s;
    var f_quot = false;
    if (s.indexOf("\n") >= 0 || s.indexOf("\r") >= 0) f_quot = true;
    if (s.indexOf(delimiter) >= 0) f_quot = true;
    if (s.indexOf('"') >= 0) {
      f_quot = true;
      s = s.replace(/\"/g, '""');
    }
    if (f_quot) s = '"' + s + '"';
    return s;
  });
}

// exports
module.exports = {
  "options"       : options,
  "parse"         : parse,
  "stringify"     : stringify
};
