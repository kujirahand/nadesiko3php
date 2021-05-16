<?php
//
// 正規表現では処理できない(あるいは行番号が数えられない)規則を個別に扱う
//

$nako3lex_error = function (&$src, &$token, $rule, &$line) {
  $name = $rule['name'];
  throw new Exception("突然、[$name]があります。");
};

$nako3lex_stringEx = function(&$src, &$token, $rule, &$line) {
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
    if ($ch == "\n") { $line++; }
    $src = substr($src, strlen($ch));
    // todo: 文字列の展開のための処理
  }
  throw new Exception("文字列の終端記号[$eos]がありません。");
};

$nako3lex_string = function(&$src, &$token, $rule, &$line) {
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
    if ($ch == "\n") { $line++; }
    $src = substr($src, strlen($ch));
  }
  throw new Exception("文字列の終端記号[$eos]がありません。");
};

$nako3lex_rangeComment = function(&$src, &$token, $rule, &$line) {
  $src = substr($src, 2); // skip /*
  $res = '';
  while ($src != '') {
    if (substr($src, 0, 2) == '*/') {
      $src = substr($src, 2);
      $token['value'] = $res;
      return true;
    }
    $ch = mb_substr($src, 0, 1);
    $res .= $ch;
    if ($ch == "\n") { $line++; }
    $src = substr($src, strlen($ch));
  }
  throw new Exception('範囲コメントで終端[*/]がありません。');
};

$nako3lex_word = function(&$src, &$token, $rule, &$line) {
  $kanakanjiRE = '#^[\u3005\u4E00-\u9FCF_a-zA-Z0-9ァ-ヶー]+#';
  $hiraRE = '/^[ぁ-ん]/';
  $allHiraganaRE = '/^[ぁ-ん]+$/';
  $wordHasIjoIkaRE = '/^.+(以上|以下|超|未満)$/';


};



