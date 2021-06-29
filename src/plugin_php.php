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
    'fn' => function($file, $sys) {
      include $file;
    },
  ],
];
