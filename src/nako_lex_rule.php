<?php
/**
 * なでしこの字句解析ルールを定義したもの
 */

require_once __DIR__.'/nako_lex_rule_parser.php';


global $nako3lex_rules;
$nako3lex_rules = [
  ['name'=>'ここまで', 's'=>';;;'],
  ['name'=>'eol', 's'=>"\n"],
  ['name'=>'eol', 's'=>";"],
  ['name'=>'space', 're'=>'#^(\s|・)+#'],
  ['name'=>'line_comment', 're'=>'/^#[^\n]*/'],
  ['name'=>'line_comment', 're'=>'#^//[^\n]*#'],
  ['name'=>'def_func', 's'=>'●'],
  ['name'=>'number', 're'=>'#^[0-9]+\.[0-9]+#'],
  ['name'=>'number', 're'=>'#^[0-9]+#'],
  ['name'=>'number', 're'=>'#^0x[0-9a-fA-F]+#'],
  ['name'=>'string_ex', 's'=>'"', 'parser' => $nako3lex_stringEx],
  ['name'=>'string', 's'=>"'", 'parser' => $nako3lex_string],
  ['name'=>'string_ex', 's'=>'「', 'eos'=>'」', 'parser' => $nako3lex_stringEx],
  ['name'=>'string', 's'=>"『", 'eos'=>'』', 'parser' => $nako3lex_string],
];


