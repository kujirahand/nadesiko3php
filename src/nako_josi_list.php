<?php
global $nako3josi;

$josiList = [
  'について', 'くらい', 'なのか', 'までを', 'までの', 'による', 'である',
  'とは', 'から', 'まで', 'だけ', 'より', 'ほど', 'など',
  'いて', 'えて', 'きて', 'けて', 'して', 'って', 'にて', 'みて',
  'めて', 'ねて', 'では', 'には', 'は~', 'んで', 'こと',
  'は', 'を', 'に', 'へ', 'で', 'と', 'が', 'の'
];
// ただし「こと」は「＊＊すること」のように使う特殊な助詞 #936
// 「である」は「＊＊である」のように使う特殊な助詞 #939
$tararebaJosiList = [
  'でなければ', 'なければ', 'ならば', 'なら', 'たら', 'れば'
];

// 一覧をプログラムで扱いやすいようマップに変換
$tarareba = [];
foreach ($tararebaJosiList as $e) {
  $josiList[] = $e;
  $tarareba[$e] = true;
}

// 文字数の長い順に並び替え
usort($josiList, function($a, $b) {
  return strlen($b) - strlen($a);
});

// 正規表現で助詞をマッチできるようにする
$josiRE = "#^(".implode('|', $josiList).")#";

$nako3josi = [
  're' => $josiRE,
  'tarareba' => $tarareba,
];



