<?php

$nako3lex_stringEx = function(&$src, &$token, $rule) {
  $eos = $rule['eos'];
  $sos = isset($rule['sos']) ? $rule['sos'] : $eos;
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
    // todo: 文字列の展開のための処理
  }
  throw new Exception("文字列の終端記号[$eos]がありません。");
};

$nako3lex_string = function(&$src, &$token, $rule) {
  $eos = $rule['eos'];
  $sos = isset($rule['sos']) ? $rule['sos'] : $eos;
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


