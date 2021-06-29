<?php
include_once 'testunit.php';
require_once $src_dir.'/nako_prepare.php';

test_group('nako3prepare_conv1ch');
test_eq(nako3prepare_conv1ch('Ａ'), 'A', '全角英数→半角');
test_eq(nako3prepare_conv1ch('※'), '#', '変換テーブル');
test_eq(nako3prepare_conv1ch('あ'), 'あ', '変換なし');

test_group('nako3prepare_convert');
test_eq(nako3prepare_convert('あＡ※'), 'あA#', '単純');
test_eq(nako3prepare_convert('あ"※"Ａ'), 'あ"※"A', '"文字列"');
test_eq(nako3prepare_convert('あ「※」Ａ'), 'あ「※」A', '「文字列」');
test_eq(nako3prepare_convert('あ『※』Ａ'), 'あ『※』A', '『文字列』');

