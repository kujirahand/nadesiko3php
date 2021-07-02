# なでしこ3PHP - nadesiko3php

日本語プログラミング言語「なでしこ」をPHPで動かすプロジェクト。
サーバーでの利用を想定しています。

- [なでしこ3PHPに関する詳しい説明](https://nadesi.com/doc3/index.php?nadesiko3php) 
  - [開発「なでしこ3」のリポジトリ](https://github.com/kujirahand/nadesiko3)
    - [利用サンプル](https://github.com/kujirahand/phpnako-exampe-bbs/)
- [「なでしこ3」のWEBサイト](https://nadesi.com/)


## これは何？

日本語プログラミング言語「なでしこ」をPHP上で動かすためのプロジェクトです。格安のレンタルサーバーではスクリプト言語としてPHPが採用されていることが多いようです。そこで、なでしこ3PHPを使えば、そうした格安サーバーでもなでしこのプログラムを動かせます。

## 動作原理

なでしこ3PHPの仕組みですが、なでしこ3のプログラムをPHPのプログラムに変換します。

もともと、なでしこ3では、なでしこのプログラムを、抽象木構文(AST)に変換し、それを元にしてJavaScriptを出力しています。そこで、このプロジェクトでは抽象木構文(AST)からPHPのプログラムを出力します。

なお、PHPとJavaScriptは非常によく似ています。出力するコードをJSからPHPに書き換えるのも、それほど大変ではありませんでした。そのため、実質1日の作業で対応できました。ただし、なでしこの標準関数はかなり量があるので、それをPHPに移植するのに数日かかりましたが。

 - なでしこ3 → AST → JavaScript (なでしこ3オリジナル)
 - なでしこ3 → AST → PHP (なでしこ3PHP)

この仕組みを利用すれば、他のプログラミング言語を出力するのも簡単です。

## 実行に必要なツール

なでしこ3エンジンコアは、Node.jsで開発されています。
そのため、PHP7以上と[Node.js](https://nodejs.org)を最初にインストールしておいてください。

## なでしこ3PHPのインストール方法

npmを使ってインストールする場合:

```
$ npm -g install nadesiko3php
```

リポジトリから取得する場合:

```
$ git clone https://github.com/kujirahand/nadesiko3php.git
$ npm install
```

リポジトリから取得した場合は、`npm bin`のディレクトリにパスを通してください。


## 使い方

コマンドラインで以下のようなコマンドを実行すると「(プログラム).php」というファイル(およびなでしこ3ランタイムが入ったsrcフォルダ)が作成されます。

```
$ phpnako -c (プログラム).nako3
```

### サーバーで動かす場合

生成したプログラム(*.php)＋本リポジトリのsrcフォルダ(なでしこ3ランタイム)をWebサーバーに配置すると実行できます。


## コマンドラインで即時実行もできます

なお、普通にコマンドラインでPHPを使いたい場合は、以下のように記述してプログラムを即時実行できます。Node.js版のcnako3でも同じように実行できますが、PHP版も意外と便利かも。

```
# 普通にプログラムを即時実行
$ phpnako (プログラム).nako3

# ワンライナーでコマンドラインでプログラムを指定して実行
$ phpnako -e "1+2×3を表示。"
```
