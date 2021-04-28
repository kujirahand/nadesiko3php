<?php
/**
 * なでしこの字句解析を行う
 */
require_once __DIR__.'/nako_lex_rule.php';

function nako3lex($src, $line = 1, $filename = '') {
  global $nako3lex_rules;
  $tokens = [];
  while ($src != '') {
    $hasRule = false;
    foreach ($nako3lex_rules as $rule) {
      // 正規表現でマッチ
      if (!preg_match($rule['re'], $src, $m)) { continue; }
      $ms = $m[0];
      $hasRule = true;
      // 空白はトークンに追加しない
      if ($rule['name'] == 'space') {
        $src = substr($src, strlen($ms));
        break;
      }
      $token = ['name' => $rule['name'], 'value' => $ms];
      // parserを使う？
      if (isset($rule['parser'])) {
        $rule['parser']($src, $token, $rule);
        $tokens[] = $token;
        break;
      }
      // トークンを追加
      $tokens[] = $token;
      $src = substr($src, strlen($ms));
      break;
      // todo
      if (isset($rule['josi']) && $rule['josi']) {
        //todo: read josi
      }
      throw new Exception('字句解析のシステムエラー');
    }
    if (!$hasRule) {
      $ch = mb_substr($src, 0, 1);
      throw new Exception("字句解析で不明な文字『{$ch}』");
    }
  }
  return $tokens;
}

function nako3lex_str($src) {
  $tokens = nako3lex($src);
  $res = [];
  foreach ($tokens as $t) {
    $res[] = $t['name'];
  }
  return implode(',', $res);
}


