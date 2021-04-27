<?php

$nako3lex_stringEx = function(&$src, &$token, $rule) {
  $sos = $rule['s'];
  $eos = isset($rule['eos']) ? $rule['eos'] : $sos;
  $res = '';
  // skip $sos
  $src = substr($src, strlen($sos));
  while ($src != '') {
    // end of string?
    if ($eos == substr($src, 0, strlen($eos))) {
      $src = substr($src, strlen($eos));
      $token['value'] = $res;
      return true;
    }
    $ch = mb_substr($src, 0, 1);
    $res .= $ch;
    $src = substr($src, strlen($ch));
  }
  throw new Exception("文字列の終端記号[$eos]がありません。");
};

$nako3lex_string = function(&$src, &$token, $rule) {
  $sos = $rule['s'];
  $eos = isset($rule['eos']) ? $rule['eos'] : $sos;
  $res = '';
  // skip $sos
  $src = substr($src, strlen($sos));
  while ($src != '') {
    // end of string?
    if ($eos == substr($src, 0, strlen($eos))) {
      $src = substr($src, strlen($eos));
      $token['value'] = $res;
      return true;
    }
    $ch = mb_substr($src, 0, 1);
    $res .= $ch;
    $src = substr($src, strlen($ch));
  }
  throw new Exception("文字列の終端記号[$eos]がありません。");
};

