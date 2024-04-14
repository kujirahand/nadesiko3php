# なでしこ3PHP - nadesiko3php

日本語プログラミング言語「なでしこ」をPHPで動かすプロジェクト。
サーバーでの利用を想定しています。

- [「なでしこ3」のWEBサイト](https://nadesi.com/)
  - [なでしこ3PHPに関する詳しい説明](https://nadesi.com/doc3/index.php?nadesiko3php) 
  - [開発「なでしこ3」のリポジトリ](https://github.com/kujirahand/nadesiko3)
    - [利用サンプル](https://github.com/kujirahand/phpnako-exampe-bbs/)

使い方を確認するには、[利用サンプル](https://github.com/kujirahand/phpnako-exampe-bbs/) を確認すると良いでしょう。


## これは何？

日本語プログラミング言語「なでしこ」をPHP上で動かすためのプロジェクトです。格安のレンタルサーバーではスクリプト言語としてPHPが採用されていることが多いようです。そこで、なでしこ3PHPを使えば、そうした格安サーバーでもなでしこのプログラムを動かせます。

参考までに、2022年8月時点での格安レンタルサーバーの価格です。いずれも月々のお小遣いで契約できる価格(大抵、キャンペーンがあるのでもっと安い)です。

| 提供者 | 価格 | URL |
|-------|-----|---------------------|
| ロリポップ  |  月132円(初期費用:1650円)  | https://lolipop.jp/ |
| さくらのレンタルサーバー | 1年1571円(月換算131円) | https://rs.sakura.ad.jp/ |
| Xserver | 1年分一括1100円(月換算92円) | https://www.xserver.ne.jp/ |
| ConoHa WING | 1時間2.2円(月1320円) | https://www.conoha.jp/wing/ |


## 動作原理

なでしこ3PHPの仕組みですが、なでしこ3のプログラムをPHPのプログラムに変換して実行します。

もともと、オリジナルの「なでしこ3」では、なでしこのプログラムを、抽象木構文(AST)に変換して、それを元にしてJavaScriptを出力しています。
そこで、このプロジェクトでは抽象木構文(AST)からPHPのプログラムを出力します。

 - なでしこ3 → AST → JavaScript (なでしこ3オリジナル)
 - なでしこ3 → AST → PHP (なでしこ3PHP)

## 実行に必要なツール

なでしこ3エンジンのコアは、Node.jsで開発されています。
そのため、実行には[PHP7以上](https://www.php.net/)と[Node.js](https://nodejs.org)が必要です。

## Windowsでなでしこ3PHPをインストールする方法

- (1) 本リポジトリに含まれる、[win32-start.nako](/win32-start.nako)と[php.ini](/php.ini)を同じフォルダに保存します。
- (2) [なでしこv1](https://nadesi.com/top/go.php?6)をダウンロードし、なでしこエディタ(nakopad.exe)で`win32-start.nako`を開いて実行してください。
- (3) ボタンが複数表示されるので、上から順にボタンをクリックしていくと、セットアップできます。
- (4) 本リポジトリの[win32-edit.nako](/win32-edit.nako)を使うと、なでしこ3PHPの専用エディタが起動します。
  - なでしこv1で作られたエディタなので、Shift_JIS外の文字コード(絵文字を含む)を扱えませんが、手軽になでしこ3PHPのコードを実行できます。
- 手順をまとめた[マニュアル(PDF)](https://github.com/kujirahand/nadesiko3php/files/8837840/help.pdf)もあります。ご覧ください。

## 上記の方法を使わず、なでしこ3PHPのインストール方法

npmを使ってインストールする場合:

```sh
npm -g install nadesiko3php
```

リポジトリから取得する場合:

```sh
git clone https://github.com/kujirahand/nadesiko3php.git
npm install
```

リポジトリから取得した場合は、`npm bin`のディレクトリにパスを通してください。


## 使い方

コマンドラインで以下のようなコマンドを実行すると「(プログラム).php」というファイル(およびなでしこ3ランタイムが入ったsrcフォルダ)が作成されます。

```sh
phpnako -c (プログラム).nako3
```

## 監視モード（即時自動コンパイル）で効率アップ

あるいは作業しているフォルダに対して監視を行って、「.nako3」ファイルが更新されたら自動的にコンパイルするように指定できます。

```sh
cd (作業対象のパス)
phpnako --watch
```

なおPHPのサーバーモードを使えば、なでしこPHPとPHPだけで開発が可能です。以下のコマンドでPHPのサーバーが起動します。その後、ブラウザで「[http://localhost:8888](http://localhost:8888)」へアクセスすると実行結果を確認できます。

```sh
# PHPのローカルサーバーを利用する場合
php -S localhost:8888 -c php.ini
```

### レンタルサーバーなどにアップして動かす場合

生成したプログラム(*.php)＋本リポジトリのsrcフォルダ(なでしこ3ランタイム)をWebサーバーに配置すると実行できます。


## コマンドラインで即時実行もできます

なお、普通にコマンドラインでPHPを使いたい場合は、以下のように記述してプログラムを即時実行できます。Node.js版のcnako3でも同じように実行できますが、PHP版も意外と便利かも。

```sh
# 普通にプログラムを即時実行
phpnako (プログラム).nako3
```

```sh
# ワンライナーでコマンドラインでプログラムを指定して実行
phpnako -e "1+2×3を表示。"
```

# 利用できる命令

なでしこ３の以下のプラグイン命令が使えます。

 - [plugin_system](https://nadesi.com/v3/doc/index.php?plugin_system&show)
 - [plugin_node](https://nadesi.com/v3/doc/index.php?plugin_node&show)
 - [plugin_php](https://github.com/kujirahand/nadesiko3php/blob/main/src/plugin_php.php)

# プラグインの作り方

- (1) プラグインを作ります。[plugin_php.php](src/plugin_php.php)が参考になります。
- (2) PHPプログラムから自動的に関数定義をJSONでエクスポートします。`cd src && php convert_php2json.php`を実行します。





