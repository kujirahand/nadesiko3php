<?php
//
// 正規表現では処理できない(あるいは行番号が数えられない)規則を個別に扱う
//

// 助詞一覧
require_once __DIR__.'/nako_josi_list.php';

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
  global $nako3josi;
  $kanakanjiRE = '#^[\u3005\u4E00-\u9FCF_a-zA-Z0-9ァ-ヶー]+#';
  $hiraRE = '/^[ぁ-ん]/';
  $allHiraganaRE = '/^[ぁ-ん]+$/';
  $josiRE = $nako3josiRE;

  $res = '';
  $josi = '';
  while ($src != '') {
    if ($res != '') {
      // 助詞がある？
      if (preg_match($josiRE, $src, $m)) {
        $josi = $m[0];
        $src = substr($src, strlen($josi));
        // 助詞の直後にあるカンマを飛ばす
        if (substr($src, 0, 1) == ',') { $src = substr($src, 1); }
        break;
      }
    }
    // カタカナ漢字英数字か？
    if (preg_match($kanakanjiRE, $src, $m)) {
      $res .= $m[0];
      $src = substr($src, strlen($m[0]));
      continue;
    }
    // ひらがな？
    if (preg_match($hiraRE, $src, $m)) {
      $res .= $m[0];
      $src = substr($src, strlen($m[0]));
      continue;
    }
    // その他の文字
    break;
  }
  // 間の特殊ルール
  // 等しい間、一致する間なら、間をsrcに戻す、ただしシステム時間はそのままに
  if (preg_match('/[ぁ-ん]間$/', $res)) {
    $src = '間'.$src;
    $res = mb_substr($res, 0, mb_strlen($res) - 1);
  }
  // 以上、以下、超、未満
  $wordHasIjoIkaRE = '/^.+(以上|以下|超|未満)$/';
  if (preg_match($wordHasIjoIkaRE, $res, $m)) {
    $src = $m[1].$josi.$src;
    $josi = '';
    $res = mb_substr($res, 0, mb_strlen($res) - mb_strlen($m[1]));
  }
  // こと、である、です、などは削除
  // todo:
};



