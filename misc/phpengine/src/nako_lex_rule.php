<?php
/**
 * なでしこの字句解析ルールを定義したもの
 */

require_once __DIR__.'/nako_lex_rule_parser.php';


global $nako3lex_rules;
$nako3lex_rules = [
  ['name'=>'ここまで',      're'=>'#^;;;#'],
  ['name'=>'eol',           're'=>"#^\n#"],
  ['name'=>'eol',           're'=>"#^;#"],
  ['name'=>'space',         're'=>'#^(\s|・)+#'],
  ['name'=>'line_comment',  're'=>'/^#[^\n]*/'],
  ['name'=>'line_comment',  're'=>'#^//[^\n]*#'],
  ['name'=>'range_comment', 're'=>'#^\/\*#', 'parser' => $nako3lex_rangeComment],
  ['name'=>'def_func',      're'=>'#^●#'],
  // 数値
  ['name'=>'number',        're'=>'#^[0-9]+\.[0-9]+#', 'josi'=>1],
  ['name'=>'number',        're'=>'#^[0-9]+#', 'josi'=>1],
  ['name'=>'number',        're'=>'#^0x[0-9a-fA-F]+#', 'josi'=>1],
  // 文字列
  ['name'=>'string_ex',     're'=>'#^"#', 'eos'=>'"', 
                            'parser' => $nako3lex_stringEx, 'josi'=>1],
  ['name'=>'string',        're'=>"#^'#", 'eos'=>"'", 
                            'parser' => $nako3lex_string, 'josi'=>1],
  ['name'=>'string_ex',     're'=>'#^「#', 'sos'=>'「', 'eos'=>'」', 
                            'parser' => $nako3lex_stringEx, 'josi'=>1],
  ['name'=>'string',        're'=>"#^『#", 'sos'=>'『', 'eos'=>'』', 
                            'parser' => $nako3lex_string, 'josi'=>1],
  ['name'=> 'string',       're'=> '#^🌿#', 'sos'=>'🌿', 'eos'=>'🌿',
                            'parser' => $nako3lex_string, 'josi'=>1],
  ['name'=> 'string',       're'=> '#^🌴#', 'sos'=>'🌴', 'eos'=>'🌴',
                            'parser' => $nako3lex_string, 'josi'=>1],
  // キーワード
  ['name'=>'ここまで',      're'=>'#^(ここまで|💧)#'],
  ['name'=>'もし',          're'=>'#^もしも?#'],
  ['name'=>'違えば',        're'=>'#^違(えば)?#'],
  // 演算子
  ['name'=> 'shift_r0',     're'=> '#^>>>#'],
  ['name'=> 'shift_r',      're'=> '#^>>#'],
  ['name'=> 'shift_l',      're'=> '#^<<#'],
  ['name'=> 'gteq',         're'=> '#^(≧|>=|=>)#'],
  ['name'=> 'lteq',         're'=> '#^(≦|<=|=<)#'],
  ['name'=> 'noteq',        're'=> '#^(≠|<>|!=)#'],
  ['name'=> 'eq',           're'=> '#^=#'],
  ['name'=> 'line_comment', 're'=> '#^!(インデント構文|ここまでだるい)[^\n]*#'],
  ['name'=> 'not',          're'=> '#^!#'],
  ['name'=> 'gt',           're'=> '#^>#'],
  ['name'=> 'lt',           're'=> '#^<#'],
  ['name'=> 'and',          're'=> '#^(かつ|&&)#'],
  ['name'=> 'or',           're'=> '#^(または|或いは|あるいは|\|\|)#'],
  ['name'=> '@', 're'=> '#^@#'],
  ['name'=> '+', 're'=> '#^\+#'],
  ['name'=> '-', 're'=> '#^-#'],
  ['name'=> '*', 're'=> '#^(×|\*)#'],
  ['name'=> '/', 're'=> '#^(÷|\/)#'],
  ['name'=> '%', 're'=> '#^%#'],
  ['name'=> '^', 're'=> '#^\^#'],
  ['name'=> '&', 're'=> '#^&#'],
  ['name'=> '[', 're'=> '#^\[#'],
  ['name'=> ']', 're'=> '#^]#', 'josi'=>1],
  ['name'=> '(', 're'=> '#^\(#'],
  ['name'=> ')', 're'=> '#^\)#', 'josi'=>1],
  ['name'=> '|', 're'=> '#^\|#'],
  ['name'=> '」', 're'=> '#^」#', 'parser'=> $nako3lex_error], // error
  ['name'=> '』', 're'=> '#^』#', 'parser'=> $nako3lex_error], // error
  ['name'=> 'func', 're'=> '#^\{関数\],?#'],
  ['name'=> '{', 're'=> '#^\{#'],
  ['name'=> '}', 're'=> '#^\}#', 'josi'=>1],
  ['name'=> ':', 're'=> '#^:#'],
  ['name'=> '_eol', 're'=> '#^_\s*\n#'],
  ['name'=> 'dec_lineno', 're'=> '#^‰#'],
  // 絵文字変数 = (絵文字)英数字*
  ['name'=> 'word', 're'=> '#^[\uD800-\uDBFF][\uDC00-\uDFFF][_a-zA-Z0-9]*#', 'josi'=>1],
  ['name'=> 'word', 're'=> '#^[\u1F60-\u1F6F][_a-zA-Z0-9]*#', 'josi'=>1], // 絵文字
  ['name'=> 'word', 're'=> '#^《.+?》#', 'josi'=>1], // 《特別名前トークン》(#672)
  // 単語
  ['name'=> 'word', 're'=> '#^[_a-zA-Z\u3005\u4E00-\u9FCFぁ-んァ-ヶ]#',
   'parser'=> $nako3lex_word],
];


