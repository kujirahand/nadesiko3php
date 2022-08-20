<?php
// PHPに関する機能を宣言したもの
global $nako3;
$exports = [
  // 初期化
  '初期化' => [
    'type' => 'func',
    'josi' => [],
    'fn' => function($nako3) {
      // システム変数に必要な値を代入しておく
      global $__v0;
      $__v0['GET'] = isset($_GET) ? $_GET : [];
      $__v0['POST'] = isset($_POST) ? $_POST : [];
      $__v0['FILES'] = isset($_FILES) ? $_FILES : [];
      $__v0['SERVER'] = isset($_SERVER) ? $_SERVER : [];
      if (isset($_SESSION)) {
        $__v0['SESSION'] = &$_SESSION;
      } else {
        $__v0['SESSION'] = [];
      }
    },
    'return_none' => TRUE,
  ],
  // @PHP定数
  'PHPバージョン' => ['type'=>'const', 'value' => phpversion()], // @PHPばーじょん
  'PLUGIN_PHPバージョン' => ['type'=>'const', 'value' => '0.0.1'], // @PLUGIN_PHPばーじょん
  // @PHPシステム
  'PHP取込'=> [ // @PHPファイルを取り込む。 // @PHPとりこむ
    'type' => 'func',
    'josi' => [['を','の','から']],
    'fn' => function($file) {
      include $file;
    },
    'return_none' => TRUE,
  ],
  'PHP関数実行'=> [ // @PHPの関数Fを引数ARGSで実行する。 // @PHPかんすうじっこう
    'type' => 'func',
    'josi' => [['を'], ['で', 'にて']],
    'fn' => function($f, $args) {
      if (!is_array($args)) { $args = [$args]; }
      return call_user_func_array($f, $args);
    },
    'return_none' => FALSE,
  ],
  'セッション開始'=> [ // @PHPセッションを開始する。 // @せっしょんかいし
    'type' => 'func',
    'josi' => [],
    'fn' => function() {
      @session_start();
    },
    'return_none' => TRUE,
  ],
  'クッキー取得'=> [ // @cookieパラメータのKEYを、省略値DEFで取得する // @くっきーしゅとく
    'type' => 'func',
    'josi' => [['を'],['で', 'にて']],
    'fn' => function($key, $def) {
      return empty($_COOKIE[$key]) ? $def : $_COOKIE[$key];
    },
  ],
  'クッキー設定'=> [ // @cookieのKEYをVに設定する // @くっきーせってい
    'type' => 'func',
    'josi' => [['を'],['へ','に']],
    'fn' => function($key, $v) {
      global $__v0;
      $opt = isset($__v0['クッキーオプション']) ? $__v0['クッキーオプション'] : [];
      setcookie($key, $v, $opt);
    },
    'return_none' => TRUE,
  ],
  'クッキーオプション' => ['type'=>'const', 'value'=>[]], // @くっきーおぷしょん  
  'クッキーオプション設定'=> [ // @cookieのオプションを辞書型で設定する // @くっきーおぷしょんせってい
    'type' => 'func',
    'josi' => [['を','へ','に']],
    'fn' => function($v) {
      global $__v0;
      $__v0['クッキーオプション'] = $v;
    },
    'return_none' => TRUE,
  ],
  'GET' => ['type'=>'const', 'value'=>[]], // @GET
  'POST' => ['type'=>'const', 'value'=>[]], // @POST 
  'SERVER' => ['type'=>'const', 'value'=>[]], // @SERVER
  'FILES' => ['type'=>'const', 'value'=>[]], // @FILES 
  'SESSION' => ['type'=>'const', 'value'=>[]], // @SESSION
  'GET取得'=> [ // @GETパラメータのKEYを、省略値DEFで取得する // @GETしゅとく
    'type' => 'func',
    'josi' => [['を'],['で', 'にて']],
    'fn' => function($key, $def) {
      return empty($_GET[$key]) ? $def : $_GET[$key];
    },
  ],
  'POST取得'=> [ // @POSTパラメータのKEYを、省略値DEFで取得する // @POSTしゅとく
    'type' => 'func',
    'josi' => [['を'],['で', 'にて']],
    'fn' => function($key, $def) {
      return empty($_POST[$key]) ? $def : $_POST[$key];
    },
  ],
  'セッション取得'=> [ // @セッションパラメータのKEYを、省略値DEFで取得する // @せっしょんしゅとく
    'type' => 'func',
    'josi' => [['を'],['で', 'にて']],
    'fn' => function($key, $def) {
      return empty($_SESSION[$key]) ? $def : $_SESSION[$key];
    },
  ],
  'セッション設定'=> [ // @セッションパラメータのKEYをVに設定する // @せっしょんせってい
    'type' => 'func',
    'josi' => [['を'],['に', 'で', 'へ']],
    'fn' => function($key, $v) {
      $_SESSION[$key] = $v;
    },
    'return_none' => TRUE,
  ],
  'ヘッダ設定'=> [ // @HTTPヘッダをVに設定する // @へっだせってい
    'type' => 'func',
    'josi' => [['に', 'へ', 'の']],
    'fn' => function($v) {
      header($v);
    },
    'return_none' => TRUE,
  ],
  // @PDO
  'PDOオブジェクト' => ['type'=>'const', 'value' => null], // @PDOおぶじぇくと
  'PDO生成'=> [ // @DSNを指定してPDOを生成して返す // @PDOせいせい
    'type' => 'func',
    'josi' => [['で','の','を']],
    'fn' => function($dsn) {
      global $__v0;
      $__v0['PDOオブジェクト'] = $v = new PDO($dsn);
      $v->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      return $v;
    },
  ],
  'PDO設定'=> [ // @生成済みのPDOオブジェクトを切り替える。 // @PDOせいせい
    'type' => 'func',
    'josi' => [['に','へ']],
    'fn' => function($pdo) {
      global $__v0;
      $__v0['PDOオブジェクト'] = $pdo;
    },
    'return_none' => TRUE,
  ],
  'PDO実行'=> [ // @SQLコマンドをデータ配列Aで実行して結果を返す // @PDOじっこう
    'type' => 'func',
    'josi' => [['を'],['で','の']],
    'fn' => function($sql, $a) {
      global $__v0;
      $pdo = $__v0['PDOオブジェクト'];
      $st = $pdo->prepare($sql);
      return $st->execute($a);
    },
  ],
  'PDO全取得'=> [ // @SQLコマンドをデータ配列Aで実行して結果を全部取得して返す // @PDOぜんしゅとく
    'type' => 'func',
    'josi' => [['を'],['で','の']],
    'fn' => function($sql, $a) {
      global $__v0;
      $pdo = $__v0['PDOオブジェクト'];
      $st = $pdo->prepare($sql);
      $st->execute($a);
      return $st->fetchAll(PDO::FETCH_ASSOC);
    },
  ],
  'PDO一行取得'=> [ // @SQLコマンドをデータ配列Aで実行して結果を一行取得して返す // @PDOいちぎょうしゅとく
    'type' => 'func',
    'josi' => [['を'],['で','の']],
    'fn' => function($sql, $a) {
      global $__v0;
      $pdo = $__v0['PDOオブジェクト'];
      $st = $pdo->prepare($sql);
      $st->execute($a);
      return $st->fetch(PDO::FETCH_ASSOC);
    },
  ],
  'PDO挿入ID取得'=> [ // @PDO実行の結果、挿入したIDを得る。 // @PDOそうにゅうIDしゅとく
    'type' => 'func',
    'josi' => [],
    'fn' => function() {
      global $__v0;
      $pdo = $__v0['PDOオブジェクト'];
      return $pdo->lastInsertId();
    },
  ],
  // @HTML
  'HTML変換'=> [ // @文字列SをHTMLに変換して返す // @HTMLへんかん
    'type' => 'func',
    'josi' => [['を','から']],
    'fn' => function($s) {
      return htmlspecialchars($s, ENT_QUOTES);
    },
  ],
  'HTML埋込'=> [ // @文字列Sの中に辞書型データDICの値を埋め込んで返す。書式は「xxx[[変数名]]xx」のように書く。展開時に安全にHTML変換する。変換したくないものには[[変数名|raw]]と書く。改行を変換したい場合は[[変数名|br]]と書く。または[[変数名|書式]]を記述(書式はsprintfかdate/time/datetime)。// @HTMLうめこむ
    'type' => 'func',
    'josi' => [['に','へ'],['を']],
    'fn' => function($s, $dic) {
      $subject = $s;
      return preg_replace_callback('#\[\[(.*?)\]\]#', function($m)use($dic) {
        $key = $m[1];
        $raw = FALSE;
        $br = FALSE;
        $fmt = '';
        if (strpos($key, '|') !== FALSE) {
          if (preg_match('#\s*(.+?)\s*\|\s*([%a-zA-Z0-9_]+)#', $key, $m)) {
            $key = $m[1];
            if ($m[2] == 'raw') {
              $raw = TRUE;
            } else if ($m[2] == 'br') {
              $br = TRUE;
            } else {
              $fmt = $m[2];
            }
          }
        }
        $val = isset($dic[$key]) ? $dic[$key] : '';
        if (!$raw) {
          if ($fmt == 'date') {
            $val = date('Y/m/d', intval($val));
          } else if ($fmt == 'time') {
            $val = date('H:i:s', intval($val));
          } else if ($fmt == 'datetime') {
            $val = date('Y/m/d H:i:s', intval($val));
          } else if ($fmt != '') {
            $val = sprintf($fmt, $val);
          }
          $val = htmlspecialchars($val, ENT_QUOTES);
          if ($br) {
            $val = str_replace("\n", '<br>', $val);
          }
        }
        return $val;
      }, $subject);
    },
  ],
  // @KUDB
  'KUDB接続'=> [ // @簡易ドキュメントデータベースKUDBに接続する。DBにはファイルパスを指定する。 // @　KUDBせつぞく
    'type' => 'func',
    'josi' => [['に','へ','の']],
    'fn' => function($dbfile) {
      global $__v0, $__kudb, $__kudb_cache;
      // check db cache
      if (empty($__kudb_cache)) { $__kudb_cache = []; }
      if (!empty($__kudb_cache[$dbfile])) {
        $__kudb = $__kudb_cache[$dbfile];
        return $__kudb;
      }
      // open db
      $db = new PDO("sqlite:$dbfile");
      $__kudb_cache[$dbfile] = $db;
      $__kudb = $db;
      $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $db->exec('
        CREATE TABLE IF NOT EXISTS kudb (
          id INTEGER PRIMARY KEY,
          doc TEXT DEFAULT "",
          tag TEXT DEFAULT "",
          ctime INTEGER DEFAULT 0,
          mtime INTEGER DEFAULT 0
        )');
      $db->exec('
        CREATE TABLE IF NOT EXISTS kudb_params (
          id INTEGER PRIMARY KEY,
          key TEXT DEFAULT "",
          value TEXT DEFAULT ""
        )');
      return $db;
    },
  ],
  'KUDB全取得'=> [ // @KUDBに挿入したドキュメントを全部返す // @KUDBぜんしゅとく
    'type' => 'func',
    'josi' => [],
    'fn' => function() {
      global $__kudb;
      if (empty($__kudb)) { throw new Exception('最初に『KUDB接続』で接続してください。'); }
      $sql = "SELECT * FROM kudb";
      $st = $__kudb->prepare($sql);
      $st->execute([]);
      $result = [];
      foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $id = $row['id'];
        $v = json_decode($row['doc'], TRUE);
        if (is_array($v)) { $v['_id'] = $id; }
        $result[] = $v;
      }
      return $result;
    },
  ],
  'KUDB部分取得'=> [ // @KUDBの(0起点)INDEXからCOUNT件だけ取得 // @KUDBぶぶんしゅとく
    'type' => 'func',
    'josi' => [['から'],['だけ','を']],
    'fn' => function($index, $count) {
      global $__kudb;
      if (empty($__kudb)) { throw new Exception('最初に『KUDB接続』で接続してください。'); }
      $sql = "SELECT * FROM kudb LIMIT ? OFFSET ?";
      $st = $__kudb->prepare($sql);
      $st->execute([$count, $index]);
      $result = [];
      foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $id = $row['id'];
        $v = json_decode($row['doc'], TRUE);
        if (is_array($v)) { $v['_id'] = $id; }
        $result[] = $v;
      }
      return $result;
    },
  ],
  'KUDB末尾取得'=> [ // @KUDBの(0起点)末尾から数えてINDEXからCOUNT件取得 // @KUDBまつびしゅとく
    'type' => 'func',
    'josi' => [['から'],['だけ','を']],
    'fn' => function($index, $count) {
      global $__kudb;
      if (empty($__kudb)) { throw new Exception('最初に『KUDB接続』で接続してください。'); }
      $sql = "SELECT * FROM kudb ORDER BY id DESC LIMIT ? OFFSET ?";
      $st = $__kudb->prepare($sql);
      $st->execute([$count, $index]);
      $result = [];
      foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $id = $row['id'];
        $v = json_decode($row['doc'], TRUE);
        if (is_array($v)) { $v['_id'] = $id; }
        $result[] = $v;
      }
      return $result;
    },
  ],
  'KUDB挿入'=> [ // @KUDBにオブジェクトVを挿入する(TAGプロパティを指定すると検索などに使える) // @KUDBそうにゅう
    'type' => 'func',
    'josi' => [['を']],
    'fn' => function($v) {
      global $__kudb;
      if (empty($__kudb)) { throw new Exception('最初に『KUDB接続』で接続してください。'); }
      $tag = empty($v['TAG']) ? '' : $v['TAG'];
      $sql = "INSERT INTO kudb (tag, doc, ctime, mtime) VALUES (?,?,?,?)";
      $st = $__kudb->prepare($sql);
      $st->execute([$tag, json_encode($v,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES), time(), time()]);
      return $__kudb->lastInsertId();
    },
  ],
  'KUDB更新'=> [ // @KUDBのIDをVに更新 // @KUDBこうしん
    'type' => 'func',
    'josi' => [['を'], ['に','へ']],
    'fn' => function($id, $v) {
      global $__kudb;
      if (empty($__kudb)) { throw new Exception('最初に『KUDB接続』で接続してください。'); }
      $sql = "UPDATE kudb SET tag=?, doc=?, mtime=? WHERE id=?";
      $tag = empty($v['tag']) ? '' : $v['tag'];
      $st = $__kudb->prepare($sql);
      return $st->execute([$tag, json_encode($v,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES), time(), $id]);
    },
  ],
  'KUDB削除'=> [ // @KUDBのIDを削除する // @KUDBさくじょ
    'type' => 'func',
    'josi' => [['を']],
    'fn' => function($id) {
      global $__kudb;
      if (empty($__kudb)) { throw new Exception('最初に『KUDB接続』で接続してください。'); }
      $sql = "DELETE FROM kudb WHERE id = ?";
      $st = $__kudb->prepare($sql);
      return $st->execute([$id]);
    },
  ],
  'KUDBタグ検索'=> [ // @KUDBでデータ一覧からTAGプロパティを検索する // @KUDBたぐけんさく
    'type' => 'func',
    'josi' => [['の', 'を']],
    'fn' => function($tag) {
      global $__kudb;
      if (empty($__kudb)) { throw new Exception('最初に『KUDB接続』で接続してください。'); }
      $sql = "SELECT * FROM kudb WHERE tag=?";
      $st = $__kudb->prepare($sql);
      $st->execute([$tag]);
      $result = [];
      foreach ($st->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $id = $row['id'];
        $v = json_decode($row['doc'], TRUE);
        if (is_array($v)) { $v['_id'] = $id; }
        $result[] = $v;
      }
      return $result;
    },
  ],
  'KUDBタグ削除'=> [ // @KUDBでTAGを指定して削除 // @KUDBたぐさくじょ
    'type' => 'func',
    'josi' => [['の', 'を']],
    'fn' => function($tag) {
      global $__kudb;
      if (empty($__kudb)) { throw new Exception('最初に『KUDB接続』で接続してください。'); }
      $sql = "DELETE FROM kudb WHERE tag=?";
      $st = $__kudb->prepare($sql);
      return $st->execute([$tag]);
    },
  ],
  'KUDBタグ更新'=> [ // @KUDBで指定TAGの内容をVに更新 // @KUDBたぐこうしん
    'type' => 'func',
    'josi' => [['を'], ['に','へ']],
    'fn' => function($tag, $v) {
      global $__kudb;
      if (empty($__kudb)) { throw new Exception('最初に『KUDB接続』で接続してください。'); }
      $sql = "UPDATE kudb SET doc=?, mtime=? WHERE tag=?";
      $st = $__kudb->prepare($sql);
      return $st->execute([json_encode($v,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES), time(), $tag]);
    },
  ],
];
