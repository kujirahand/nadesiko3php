<?php
// PHPに関する機能を宣言したもの
global $nako3;
$exports = [
  // @PHP定数
  'PHPバージョン' => ['type'=>'const', 'value' => phpversion()], // @PHPばーじょん
  // @PHPシステム
  'PHP取込'=> [ // @PHPファイルを取り込む。 // @PHPとりこむ
    'type' => 'func',
    'josi' => [['を','の','から']],
    'fn' => function($file) {
      include $file;
    },
  ],
  'セッション開始'=> [ // @PHPセッションを開始する。 // @せっしょんかいし
    'type' => 'func',
    'josi' => [['を','の','から']],
    'fn' => function($file) {
      @session_start();
    },
  ],
];

// システム変数に必要な値を代入しておく
global $__v0;
$__v0['GET'] = isset($_GET) ? $_GET : [];
$__v0['POST'] = isset($_POST) ? $_POST : [];
if (isset($_SESSION)) {
  $__v0['SESSION'] = &$_SESSION;
} else {
  $__v0['SESSION'] = [];
}

