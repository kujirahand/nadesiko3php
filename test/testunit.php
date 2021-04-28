<?php
global $root_dir, $src_dir, $test_dir;
global $testfile, $testgroup, $testng, $testinfo;

$root_dir = dirname(__DIR__);
$src_dir = $root_dir.'/src';
$test_dir = $root_dir.'/test';

// go test
$testinfo = [];
$testng = 0;
$files = glob("$test_dir/*.test.php");
foreach ($files as $f) {
  $testname = 'default';
  $testfile = basename($f);
  echo "# [file] $testfile\n";
  include_once $f;
}
echo "__test_end__\n";
if ($testng > 0) {
  echo "⚠︎{$testng}個のエラーがあります。\n";
  $errfile = '';
  foreach ($testinfo as $e) {
    if ($errfile != $e[0]) {
      echo "* [file] $e[0]\n";
      $errfile = $e[0];
    }
    echo $e[2]."\n";
  }
} else {
  echo "🌟ok\n";
}

/**
 * テストにグループを指定する
 */
function test_group($name) {
  global $testgroup;
  $testgroup = $name;
  echo "* $testgroup\n";
}

/**
 * テストを実行する
 */
function test_eq($real, $expect, $name = 'default') {
  global $testng, $testfile, $testgroup, $testinfo;
  if ($expect !== $real) {
    $expect = preg_replace('#(\r\n|\r|\n)#', '\n', $expect);
    $real= preg_replace('#(\r\n|\r|\n)#', '\n', $real);
    $err = "- NG: $name 🍭 $real != $expect";
    $testinfo[] = [$testfile, $testgroup, $err];
    $testng++;
    echo $err."\n";
  } else {
    echo "- ok: $name\n";
  }
}

