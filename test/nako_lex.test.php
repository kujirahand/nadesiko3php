<?php
include_once 'testunit.php';
require_once $src_dir.'/nako_lex.php';

test_group('nako3lex');
test_eq(nako3lex_str('//abc'), 'line_comment', 'comment');
test_eq(nako3lex_str('123 //abc'), 'number,line_comment', 'number+comment');
test_eq(nako3lex_str("1.1\n30"), 'number,eol,number', 'number+eol');
test_eq(nako3lex_str("123「abc」"), 'number,string_ex', 'number+string_ex');
test_eq(nako3lex_str("123'abc'"), 'number,string', 'number+string');
test_eq(nako3lex_str("123が"), 'number', 'number+josi');
test_eq(nako3lex_desc("123が"), 'number:123:が', 'number+josi');

