<?php
/**
 * なでしこの字句解析ルールを定義したもの
 */

require_once __DIR__.'/nako_lex_rule_parser.php';


global $nako3lex_rules;
$nako3lex_rules = [
  ['name'=>'ここまで', 're'=>'#^;;;#'],
  ['name'=>'eol', 're'=>"#^\n#"],
  ['name'=>'eol', 're'=>"#^;#"],
  ['name'=>'space', 're'=>'#^(\s|・)+#'],
  ['name'=>'line_comment', 're'=>'/^#[^\n]*/'],
  ['name'=>'line_comment', 're'=>'#^//[^\n]*#'],
  ['name'=>'def_func', 're'=>'#^●#'],
  ['name'=>'number', 're'=>'#^[0-9]+\.[0-9]+#', 'josi'=>1],
  ['name'=>'number', 're'=>'#^[0-9]+#', 'josi'=>1],
  ['name'=>'number', 're'=>'#^0x[0-9a-fA-F]+#', 'josi'=>1],
  ['name'=>'string_ex', 're'=>'#^"#', 'eos'=>'"', 
    'parser' => $nako3lex_stringEx, 'josi'=>1],
  ['name'=>'string', 're'=>"#^'#", 'eos'=>"'", 
    'parser' => $nako3lex_string, 'josi'=>1],
  ['name'=>'string_ex', 're'=>'#^「#', 'sos'=>'「', 'eos'=>'」', 
    'parser' => $nako3lex_stringEx, 'josi'=>1],
  ['name'=>'string', 're'=>"#^『#", 'sos'=>'『', 'eos'=>'』', 
    'parser' => $nako3lex_string, 'josi'=>1],
];


