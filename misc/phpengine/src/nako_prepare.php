<?php

// 字句解析を行う前に全角文字を半角に揃える
// ただし、文字列部分だけは、そのまま全角で出力するようにする

// 変換テーブルの定義
global $nako3prepare_table;
$nako3prepare_table = [
  "\t" => ' ', // tab to space
  '※' => '#', // ※
  '。' => ';', // 句点
  '【' => '[', // '【'
  '】' => ']', // '】'
  // 読点は「,」に変換する (#877)
  '、' => ',', // 読点 
  '，' => ',',  // 読点
  // ハイフン問題
  //"\x2d"   => '-', // ASCIIのハイフン
  "\u{2010}" => '-', // 別のハイフン
  "\u{2011}" => '-', // 改行しないハイフン
  "\u{2013}" => '-', // ENダッシュ
  "\u{2014}" => '-', // EMダッシュ
  "\u{2015}" => '-', // 全角のダッシュ
  "\u{2212}" => '-', // 全角のマイナス
  // チルダ問題
  // "\x7e"  => '~',
  "\u{02dc}" => '~', // 小さなチルダ
  "\u{02F7}" => '~', // Modifier Letter Low Tilde
  "\u{2053}" => '~', // Swung Dash - 辞書のみだし
  "\u{223c}" => '~', // Tilde Operator: 数学で Similar to
  "\u{301c}" => '~', // Wave Dash(一般的な波ダッシュ)
  "\u{FF5E}" => '~', // 全角チルダ
  // スペース問題
  // "\x20"  => ' ',
  "u{2000}" => ' ', // EN QUAD
  "u{2002}" => ' ', // EN SPACE
  "u{2003}" => ' ', // EM SPACE
  "u{2004}" => ' ', // THREE-PER-EM SPACE
  "u{2005}" => ' ', // FOUR-PER-EM SPACE
  "u{2006}" => ' ', // SIX-PER-EM SPACE
  "u{2007}" => ' ', // FIGURE SPACE
  "u{2009}" => ' ', // THIN SPACE
  "u{200A}" => ' ', // HAIR SPACE
  "u{200B}" => ' ', // ZERO WIDTH SPACE
  "u{202F}" => ' ', // NARROW NO-BREAK SPACE
  "u{205F}" => ' ', // MEDIUM MATHEMATICAL SPACE
  "u{3000}" => ' ', // 全角スペース
  "u{3164}" => ' ', // HANGUL FILLER
];

// 1文字だけ半角変換する
function nako3prepare_conv1ch($ch) {
  global $nako3prepare_table;
  $v = mb_ord($ch);
  // 半角は変換しない
  if ($v < 0x7f) return $ch;
  // テーブルによる変換
  if (isset($nako3prepare_table[$ch])) {
    return $nako3prepare_table[$ch];
  }
  // 全角半角の単純変換エリア
  if ($v >= 0xFF01 && $v <= 0xFF5E) {
    return chr($v - 0xFFE0); // 半角なので chr で出力
  }
  // その他
  return $ch;
}

function nako3prepare_convert($src) {
  $flagStr = false; // 文字列リテラルか
  $eos = ''; // 終了文字列
  $str = ''; // 文字列
  // 一文字ずつ変換する
  $res = '';
  while ($src != '') {
    if ($flagStr) {
      // 終了文字か
      if ($eos == substr($src, 0, strlen($eos))) {
        $flagStr = false;
        $res .= $eos;
        $src = substr($src, strlen($eos));
        continue;
      }
      $ch = mb_substr($src, 0, 1);
      $res .= $ch;
      $src = substr($src, strlen($ch));
      continue;
    }
    $ch = mb_substr($src, 0, 1);
    $ch_conv = nako3prepare_conv1ch($ch);
    // 文字列？
    if ($ch_conv == '"') {
      $eos = '"';
      $src = substr($src, strlen($ch));
      $res .= '"';
      $flagStr = true;
      continue;
    }
    if ($ch_conv == "'") {
      $eos = "'";
      $src = substr($src, strlen($ch));
      $res .= "'";
      $flagStr = true;
      continue;
    }
    if ($ch_conv == "「") {
      $eos = "」";
      $src = substr($src, strlen($ch));
      $res .= "「";
      $flagStr = true;
      continue;
    }
    if ($ch_conv == "『") {
      $eos = "』";
      $src = substr($src, strlen($ch));
      $res .= "『";
      $flagStr = true;
      continue;
    }
    // 削って次の文字をチェック
    $src = substr($src, strlen($ch));
    $res .= $ch_conv;
  }
  return $res;
}



