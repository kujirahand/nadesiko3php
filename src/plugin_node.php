<?php // phpnako のプラグイン
$exports = [
  // @ ファイル入出力
  '開'=> [ // @ファイルSを開く // @ひらく
    'type' => 'func',
    'josi' => [['を', 'から']],
    'fn' => function($s) {
      return file_get_contents($s);
    },
  ],
  '読'=> [ // @ファイルSを開く // @よむ
    'type' => 'func',
    'josi' => [['を', 'から']],
    'fn' => function($s, $sys) {
      return file_get_contents($s);
    },
  ],
  'バイナリ読'=> [ // @ファイルSをバイナリ(Buffer)として開く // @ばいなりよむ
    'type' => 'func',
    'josi' => [['を', 'から']],
    'fn' => function($s, $sys) {
      return file_get_contents($s);
    },
  ],
  '保存'=> [ // @データSをファイルFヘ書き込む // @ほぞん
    'type' => 'func',
    'josi' => [['を'], ['へ', 'に']],
    'fn' => function($s, $f) {
      file_put_contents($f, $s);
    },
    'return_none' => true,
  ],
  'SJISファイル読'=> [ // @SJIS形式のファイルSを読み込む // @SJISふぁいるよむ
    'type' => 'func',
    'josi' => [['を', 'から']],
    'fn' => function($s, $sys) {
      $bin = file_get_contents($s);
      $txt = mb_convert_encoding($bin, 'utf-8', 'SJIS, UTF-8, JIS, EUC-JP');
      return $txt;
    },
  ],
  'SJISファイル保存'=> [ // @SをSJIS形式でファイルFへ書き込む // @SJISふぁいるほぞん
    'type' => 'func',
    'josi' => [['を'], ['へ', 'に']],
    'fn' => function($s, $f, $sys) {
      $sjis = mb_convert_encoding($s, 'SJIS', 'UTF-8');
      file_put_contents($f, $s);
    },
    'return_none' => true,
  ],
  '起動待機'=> [ // @シェルコマンドSを起動し実行終了まで待機する // @きどうたいき
    'type' => 'func',
    'josi' => [['を']],
    'fn' => function($s) {
      return passthru(s);
    },
  ],
  '起動'=> [ // @シェルコマンドSを起動 // @きどう
    'type' => 'func',
    'josi' => [['を']],
    'fn' => function($s) {
      return passthru(s);
    },
  ],
  '起動時'=> [ // @シェルコマンドSを起動 // @きどうしたとき
    'type' => 'func',
    'josi' => [['で'], ['を']],
    'fn' => function($callback, $s, $sys) {
      system(s);
      if (is_string($callback)) {
        $callback = nako3_findVar($callback);
      }
      if (is_callable($callback)) {
        $callback($sys);
      }
    },
  ],
  'ブラウザ起動'=> [ // @ブラウザでURLを起動 // @ぶらうざきどう
    'type' => 'func',
    'josi' => [['を']],
    'fn' => function($url) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  'ファイル列挙'=> [ // @パスSのファイル名（フォルダ名）一覧を取得する。ワイルドカード可能。「*.jpg;*.png」など複数の拡張子を指定可能。 // @ふぁいるれっきょ
    'type' => 'func',
    'josi' => [['の', 'を', 'で']],
    'fn' => function($s) {
      $res = [];
      $pats = explode(";", $s);
      foreach ($pats as $pat) {
        $files = glob($pat);
        $res = array_merge($res, $files);
      }
      return $res;
    },
  ],
  '全ファイル列挙'=> [ // @パスS以下の全ファイル名を取得する。ワイルドカード可能。「*.jpg;*.png」のように複数の拡張子を指定可能。 // @ぜんふぁいるれっきょ
    'type' => 'func',
    'josi' => [['の', 'を', 'で']],
    'fn' => function($s) {
      $dir = dirname($s);
      if ($dir == '') {$dir = '.'; }
      $pat_list = explode(';', basename($s));
      $enumfiles = function ($path)use(&$enumfiles, $pat_list){
        $res = [];
        $files = scandir($path);
        foreach ($files as $f) {
          if ($f == '.' || $f == '..') {continue;}
          $fpath = $path.DIRECTORY_SEPARATOR.$f;
          if (is_dir($fpath)) {
            $subfiles = $enumfiles($fpath);
            $res = array_merge($res, $subfiles);
            continue;
          }
          $ok = false;
          foreach ($pat_list as $pat) {
            if (fnmatch($pat, $f)) {
              $ok = true; break;
            }
          }
          if ($ok) {$res[] = $fpath;}
        }
        return $res;
      };
      return $enumfiles($dir);
    },
  ],
  '存在'=> [ // @ファイルPATHが存在するか確認して返す // @そんざい
    'type' => 'func',
    'josi' => [['が', 'の']],
    'fn' => function($path) {
      return file_exists($path);
    },
  ],
  'フォルダ存在'=> [ // @ディレクトリPATHが存在するか確認して返す // @ふぉるだそんざい
    'type' => 'func',
    'josi' => [['が', 'の']],
    'fn' => function($path) {
      return file_exists($path);
    },
  ],
  'フォルダ作成'=> [ // @ディレクトリPATHを作成して返す(再帰的に作成) // @ふぉるださくせい
    'type' => 'func',
    'josi' => [['の', 'を', 'に', 'へ']],
    'fn' => function($path) {
      mkdir($path);
    },
  ],
  'ファイルコピー'=> [ // @パスAをパスBへファイルコピーする // @ふぁいるこぴー
    'type' => 'func',
    'josi' => [['から', 'を'], ['に', 'へ']],
    'fn' => function($a, $b, $sys) {
      return copy($a, $b);
    },
  ],
  'ファイルコピー時'=> [ // @パスAをパスBへファイルコピーしてcallbackを実行 // @ふぁいるこぴーしたとき
    'type' => 'func',
    'josi' => [['で'], ['から', 'を'], ['に', 'へ']],
    'fn' => function($callback, $a, $b, $sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  'ファイル移動'=> [ // @パスAをパスBへ移動する // @ふぁいるいどう
    'type' => 'func',
    'josi' => [['から', 'を'], ['に', 'へ']],
    'fn' => function($a, $b, $sys) {
      return rename($a, $b);
    },
  ],
  'ファイル移動時'=> [ // @パスAをパスBへ移動してcallbackを実行 // @ふぁいるいどうしたとき
    'type' => 'func',
    'josi' => [['で'], ['から', 'を'], ['に', 'へ']],
    'fn' => function($callback, $a, $b, $sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  'ファイル削除'=> [ // @パスPATHを削除する // @ふぁいるさくじょ
    'type' => 'func',
    'josi' => [['の', 'を']],
    'fn' => function($path, $sys) {
      return unlink($path);
    },
  ],
  'ファイル削除時'=> [ // @パスPATHを削除してcallbackを実行 // @ふぁいるさくじょしたとき
    'type' => 'func',
    'josi' => [['で'], ['の', 'を']],
    'fn' => function($callback, $path, $sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  'ファイル情報取得'=> [ // @パスPATHの情報を調べてオブジェクトで返す // @ふぁいるじょうほうしゅとく
    'type' => 'func',
    'josi' => [['の', 'から']],
    'fn' => function($path, $sys) {
      return stat($path);
    },
  ],
  'ファイルサイズ取得'=> [ // @パスPATHのファイルサイズを調べて返す // @ふぁいるさいずしゅとく
    'type' => 'func',
    'josi' => [['の', 'から']],
    'fn' => function($path, $sys) {
      return filesize($path);
    },
  ],
  // @ パス操作
  'ファイル名抽出'=> [ // @フルパスのファイル名Sからファイル名部分を抽出して返す // @ふぁいるめいちゅうしゅつ
    'type' => 'func',
    'josi' => [['から', 'の']],
    'fn' => function($s) {
      return basename($s);
    },
  ],
  'パス抽出'=> [ // @ファイル名Sからパス部分を抽出して返す // @ぱすちゅうしゅつ
    'type' => 'func',
    'josi' => [['から', 'の']],
    'fn' => function($s) {
      return dirname($s);
    },
  ],
  '絶対パス変換'=> [ // @相対パスを絶対パスに変換して返す // @ぜったいぱすへんかん
    'type' => 'func',
    'josi' => [['から', 'の']],
    'fn' => function($s) {
      return realpath($s);
    },
  ],
  '相対パス展開'=> [ // @ファイル名AからパスBを展開して返す // @そうたいぱすてんかい
    'type' => 'func',
    'josi' => [['を'], ['で']],
    'fn' => function($a, $b) {
      $a = realpath($a);
      $aa = explode('/', $a);
      $bb = explode('/', $b);
      if (substr($b, 0, 1) == '/') { return $b; }
      foreach ($bb as $i => $f) {
        if ($f == '.') {continue;}
        if ($f == '..') {
          array_pop($aa);
          continue;
        }
        array_push($aa, $f);
      }
      return implode('/', $aa);
    },
  ],
  // @ フォルダ取得
  'カレントディレクトリ取得'=> [ // @カレントディレクトリを返す // @かれんとでぃれくとりしゅとく
    'type' => 'func',
    'josi' => [],
    'fn' => function() {
      return getcwd();
    },
  ],
  'カレントディレクトリ変更'=> [ // @カレントディレクトリをDIRに変更する // @かれんとでぃれくとりへんこう
    'type' => 'func',
    'josi' => [['に', 'へ']],
    'fn' => function($dir) {
      chdir($dir);
    },
    'return_none' => true,
  ],
  '作業フォルダ取得'=> [ // @カレントディレクトリを返す // @さぎょうふぉるだしゅとく
    'type' => 'func',
    'josi' => [],
    'fn' => function() {
      return getcwd();
    },
  ],
  '作業フォルダ変更'=> [ // @カレントディレクトリをDIRに変更する // @さぎょうふぉるだへんこう
    'type' => 'func',
    'josi' => [['に', 'へ']],
    'fn' => function($dir) {
      chdir($dir);
    },
    'return_none' => true,
  ],
  'ホームディレクトリ取得'=> [ // @ホームディレクトリを取得して返す // @ほーむでぃれくとりしゅとく
    'type' => 'func',
    'josi' => [],
    'fn' => function() {
      return getenv('HOME');
    },
  ],
  'デスクトップ'=> [ // @デスクトップパスを取得して返す // @ですくとっぷ
    'type' => 'func',
    'josi' => [],
    'fn' => function($sys) {
      return getenv('HOME').'/Desktop';
    },
  ],
  'マイドキュメント'=> [ // @マイドキュメントのパスを取得して返す // @まいどきゅめんと
    'type' => 'func',
    'josi' => [],
    'fn' => function($sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  '母艦パス'=>['type'=>'const', 'value'=>''], // @ぼかんぱす
  '母艦パス取得'=> [ // @スクリプトのあるディレクトリを返す // @ぼかんぱすしゅとく
    'type' => 'func',
    'josi' => [],
    'fn' => function($sys) {
      global $__v0;
      return $__v0['母艦パス'];
    },
  ],
  // @ 環境変数
  '環境変数取得'=> [ // @環境変数Sを返す // @かんきょうへんすうしゅとく
    'type' => 'func',
    'josi' => [['の']],
    'fn' => function($s) {
      return getenv($s);
    },
  ],
  '環境変数一覧取得'=> [ // @環境変数の一覧を返す // @かんきょうへんすういちらんしゅとく
    'type' => 'func',
    'josi' => [],
    'fn' => function() {
      return getenv();
    },
  ],
  // @ 圧縮・解凍
  '圧縮解凍ツールパス'=> ['type'=> 'const', 'value'=> '7z'],
  '圧縮解凍ツールパス変更'=> [ // @圧縮解凍に使うツールを取得変更する // @あっしゅくかいとうつーるぱすへんこう
    'type' => 'func',
    'josi' => [['に', 'へ']],
    'fn' => function($v, $sys) {
      global $__v0;
      $__v0['圧縮解凍ツールパス'] = $v;
    },
    'return_none' => true,
  ],
  '解凍'=> [ // @(v1非互換)ZIPファイルAをBに解凍(実行には7-zipが必要-https://goo.gl/LmKswH) // @かいとう
    'type' => 'func',
    'josi' => [['を', 'から'], ['に', 'へ']],
    'fn' => function($a, $b, $sys) {
      global $__v0;
      $path = $__v0['圧縮解凍ツールパス'];
      $cmd = "\"$path\" x \"$a\" -o\"$b\" -y";
      return exec($cmd);
    },
  ],
  '解凍時'=> [ // @解凍処理を行い、処理が完了したときにcallback処理を実行 // @かいとうしたとき
    'type' => 'func',
    'josi' => [['で'], ['を', 'から'], ['に', 'へ']],
    'fn' => function($callback, $a, $b, $sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  '圧縮'=> [ // @(v1非互換)ファイルAをBにZIP圧縮(実行には7-zipが必要-https://goo.gl/LmKswH) // @あっしゅく
    'type' => 'func',
    'josi' => [['を', 'から'], ['に', 'へ']],
    'fn' => function($a, $b, $sys) {
      global $__v0;
      $path = $__v0['圧縮解凍ツールパス'];
      $cmd = "\"$path\" a -r \"$b\" \"$a\" -y";
      return exec($cmd);
    },
  ],
  '圧縮時'=> [ // @圧縮処理を行い完了したときにcallback処理を指定 // @あっしゅくしたとき
    'type' => 'func',
    'josi' => [['で'], ['を', 'から'], ['に', 'へ']],
    'fn' => function($callback, $a, $b, $sys) {
      throw new Exception('未実装のメソッドです');
    },
    'return_none' => true,
  ],
  // @ Nodeプロセス
  '終'=> [ // @Nodeでプログラム実行を強制終了する // @おわる
    'type' => 'func',
    'josi' => [],
    'fn' => function() {
      exit;
    },
    'return_none' => true,
  ],
  '強制終了時'=> [ // @Nodeでctrl+cでプログラムの実行が終了した時FUNCを実行する。もしFUNCが偽を返すと終了しない。非同期処理のとき動作する(#1010) // @きょうせいしゅうりょうしたとき
    'type' => 'func',
    'josi' => [['を']],
    'fn' => function($func, $sys) {
      throw new Exception('未実装のメソッドです');
    },
    'return_none' => true,
  ],
  '終了'=> [ // @Nodeでプログラム実行を強制終了する // @しゅうりょう
    'type' => 'func',
    'josi' => [],
    'fn' => function($sys) {
      exit;
    },
    'return_none' => true,
  ],
  '秒待'=> [ // @NodeでN秒待つ // @びょうまつ
    'type' => 'func',
    'josi' => [['']],
    'fn' => function($sec, $sys) {
      usleep($sec * 1000);
    },
    'return_none' => true,
  ],
  'OS取得'=> [ // @OSプラットフォームを返す(darwin/win32/linux) // @OSしゅとく
    'type' => 'func',
    'josi' => [],
    'fn' => function($sys) {
      return PHP_OS;
    },
  ],
  'OSアーキテクチャ取得'=> [ // @OSアーキテクチャを返す // @OSあーきてくちゃしゅとく
    'type' => 'func',
    'josi' => [],
    'fn' => function($sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  // @ クリップボード操作
  'クリップボード'=> [ // @クリップボードを取得設定（『クリップボード←値』で書換が可能） // @くりっぷぼーど
    'type' => 'func',
    'josi' => [['を']],
    'fn' => function($v, $sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  // @ コマンドラインと標準入出力
  'コマンドライン'=>['type'=>'const', 'value'=>''], // @こまんどらいん
  'ナデシコランタイム'=>['type'=>'const', 'value'=>'phpnako'], // @なでしこらんたいむ
  'ナデシコランタイムパス'=>['type'=>'const', 'value'=>__DIR__.'/phpnako'], // @なでしこらんたいむぱす
  '標準入力取得時'=> [ // @標準入力を一行取得した時に、無名関数（あるいは、文字列で関数名を指定）F(s)を実行する // @ひょうじゅんにゅうりょくしゅとくしたとき
    'type' => 'func',
    'josi' => [['を']],
    'fn' => function($callback) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  '尋'=> [ // @標準入力を一行取得する // @たずねる
    'type' => 'func',
    'josi' => [['と', 'を']],
    'fn' => function($msg, $sys) {
      echo $msg;
      $in = fgets(STDIN);
      return $in;
    },
  ],
  // @ テスト
  'ASSERT等'=> [ // @ mochaによるテストで、ASSERTでAとBが正しいことを報告する // @ASSERTひとしい
    'type' => 'func',
    'josi' => [['と'], ['が']],
    'fn' => function($a, $b, $sys) {
      return $a == $b;
    },
  ],
  // @ ネットワーク
  '自分IPアドレス取得'=> [ // @ネットワークアダプターからIPアドレス(IPv4)を取得して配列で返す // @じぶんIPあどれすしゅとく
    'type' => 'func',
    'josi' => [],
    'fn' => function($sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  '自分IPV6アドレス取得'=> [ // @ネットワークアダプターからIPアドレス(IPv6)を取得して配列で返す // @じぶんIPV6あどれすしゅとく
    'type' => 'func',
    'josi' => [],
    'fn' => function($sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  // @ Ajax
  'AJAX送信時'=> [ // @非同期通信(Ajax)でURLにデータを送信し、成功するとcallbackが実行される。その際『対象』にデータが代入される。 // @AJAXそうしんしたとき
    'type' => 'func',
    'josi' => [['の'], ['まで', 'へ', 'に']],
    'fn' => function($callback, $url, $sys) {
      throw new Exception('未実装のメソッドです');
    },
    'return_none' => true,
  ],
  'GET送信時'=> [ // @非同期通信(Ajax)でURLにデータを送信し、成功するとcallbackが実行される。その際『対象』にデータが代入される。 // @GETそうしんしたとき
    'type' => 'func',
    'josi' => [['の'], ['まで', 'へ', 'に']],
    'fn' => function($callback, $url, $sys) {
      throw new Exception('未実装のメソッドです');
    },
    'return_none' => true,
  ],
  'POST送信時'=> [ // @AjaxでURLにPARAMSをPOST送信し『対象』にデータを設定 // @POSTそうしんしたとき
    'type' => 'func',
    'josi' => [['の'], ['まで', 'へ', 'に'], ['を']],
    'fn' => function($callback, $url, $params, $sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  'POSTフォーム送信時'=> [ // @AjaxでURLにPARAMSをフォームとしてPOST送信し『対象』にデータを設定 // @POSTふぉーむそうしんしたとき
    'type' => 'func',
    'josi' => [['の'], ['まで', 'へ', 'に'], ['を']],
    'fn' => function($callback, $url, $params, $sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  'AJAX失敗時'=> [ // @Ajax命令でエラーが起きたとき // @AJAXえらーしっぱいしたとき
    'type' => 'func',
    'josi' => [['の']],
    'fn' => function($callback, $sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  'AJAXオプション'=>['type'=>'const', 'value'=>''], // @Ajax関連のオプションを指定 // @AJAXおぷしょん
  'AJAXオプション設定'=> [ // @Ajax命令でオプションを設定 // @AJAXおぷしょんせってい
    'type' => 'func',
    'josi' => [['に', 'へ', 'と']],
    'fn' => function($option, $sys) {
      throw new Exception('未実装のメソッドです');
    },
    'return_none' => true,
  ],
  'AJAX保障送信'=> [ // @非同期通信(Ajax)でURLにデータの送信を開始する非同期処理オブジェクト(Promise)を作成する。 // @AJAXほしょうそうしん
    'type' => 'func',
    'josi' => [['まで', 'へ', 'に']],
    'fn' => function($url, $sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  'HTTP保障取得'=> [ // @非同期通信(Ajax)でURLにデータの送信を開始する非同期処理オブジェクト(Promise)を作成する。 // @HTTPほしょうしゅとく
    'type' => 'func',
    'josi' => [['の', 'から', 'を']],
    'fn' => function($url, $sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  'GET保障送信'=> [ // @非同期通信(Ajax)でURLにデータの送信を開始する非同期処理オブジェクト(Promise)を作成する。 // @GETほしょうそうしん
    'type' => 'func',
    'josi' => [['まで', 'へ', 'に']],
    'fn' => function($url, $sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  'POST保障送信'=> [ // @非同期通信(Ajax)でURLにPARAMSをPOST送信を開始する非同期処理オブジェクト(Promise)を作成する。 // @POSTほしょうそうしん
    'type' => 'func',
    'josi' => [['まで', 'へ', 'に'], ['を']],
    'fn' => function($url, $params, $sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  'POSTフォーム保障送信'=> [ // @非同期通信(Ajax)でURLにPARAMSをフォームとしてPOST送信を開始する非同期処理オブジェクト(Promise)を作成する。  // @POSTふぉーむほしょうそうしん
    'type' => 'func',
    'josi' => [['まで', 'へ', 'に'], ['を']],
    'fn' => function($url, $params, $sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  'AJAX内容取得'=> [ // @非同期通信(Ajax)の応答から内容を指定した形式で取り出すための非同期処理オブジェクト(Promise)を返す。  // @AJAXないようしゅとく
    'type' => 'func',
    'josi' => [['から'], ['で']],
    'fn' => function($res, $type, $sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  // @ 文字コード
  '文字コード変換サポート判定'=> [ // @文字コードCODEをサポートしているか確認 // @もじこーどさぽーとはんてい
    'type' => 'func',
    'josi' => [['の', 'を']],
    'fn' => function($code, $sys) {
      throw new Exception('未実装のメソッドです');
    },
  ],
  'SJIS変換'=> [ // @(v1非互換)文字列をShift_JISのバイナリバッファに変換 // @SJISへんかん
    'type' => 'func',
    'josi' => [['に', 'へ', 'を']],
    'fn' => function($str, $sys) {
      return mb_convert_encoding($str, 'sjis');
    },
  ],
  'SJIS取得'=> [ // @Shift_JISのバイナリバッファを文字列に変換 // @SJISしゅとく
    'type' => 'func',
    'josi' => [['から', 'を', 'で']],
    'fn' => function($buf, $sys) {
      return mb_convert_encoding($buf, 'utf-8', 'sjis,utf-8,jis,euc-jp,auto');
    },
  ],
  'エンコーディング変換'=> [ // @文字列SをCODEへ変換してバイナリバッファを返す // @ えんこーでぃんぐへんかん
    'type' => 'func',
    'josi' => [['を'], ['へ', 'で']],
    'fn' => function($s, $code, $sys) {
      return mb_convert_encoding($s, $code);
    },
  ],
  'エンコーディング取得'=> [ // @バイナリバッファBUFをCODEから変換して返す // @えんこーでぃんぐしゅとく
    'type' => 'func',
    'josi' => [['を'], ['から', 'で']],
    'fn' => function($buf, $code, $sys) {
      return mb_convert_encoding($buf, 'utf-8', $code);
    },
  ],
  // @ マウスとキーボード操作
  'キー送信'=> [ // @Sのキーを送信 // @きーそうしん
    'type' => 'func',
    'josi' => [['を', 'の']],
    'fn' => function($s, $sys) {
      throw new Exception('未実装のメソッドです');
    },
    'return_none' => true,
  ],
  '窓アクティブ'=> [ // @Sの窓をアクティブにする // @まどあくてぃぶ
    'type' => 'func',
    'josi' => [['を', 'の']],
    'fn' => function($s, $sys) {
      throw new Exception('未実装のメソッドです');
    },
    'return_none' => true,
  ],
  // @ ハッシュ関数
  'ハッシュ関数一覧取得'=> [ // @利用可能なハッシュ関数の一覧を返す // @ はっしゅかんすういちらんしゅとく
    'type' => 'func',
    'josi' => [],
    'fn' => function($sys) {
      return hash_algos();
    },
  ],
  'ハッシュ値計算'=> [ // @データSをアルゴリズムALG(sha256/sha512/md5)のエンコーディングENC(hex/base64)でハッシュ値を計算して返す // @ はっしゅちけいさん
    'type' => 'func',
    'josi' => [['を'],['の'],['で']],
    'fn' => function($s, $alg, $enc, $sys) {
      if ($enc == 'base64') {
        $bin = hash($alg, $s, true);
        return base64_encode($bin);
      } else {
        return hash($alg, $s, false);
      }
    },
  ],
];

global $__v0;
// コマンドラインを更新
$__v0['コマンドライン'] = isset($argv) ? $argv : [];

