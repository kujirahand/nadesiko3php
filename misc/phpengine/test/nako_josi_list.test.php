<?php
include_once 'testunit.php';
require_once $src_dir.'/nako_josi_list.php';

test_group('nako3josi.re');
test_eq(preg_match($nako3josi['re'], 'ならば'), 1, 'ならば');
test_eq(preg_match($nako3josi['re'], 'ああ'), 0, 'ああ');
test_eq(preg_match($nako3josi['re'], 'abc'), 0, 'abc');
preg_match($nako3josi['re'], 'ならば', $m);
test_eq($m[0], 'ならば', '一致箇所のテスト');

test_group('nako3josi.tarareba');
test_eq($nako3josi['tarareba']['ならば'], true, 'ならば');

