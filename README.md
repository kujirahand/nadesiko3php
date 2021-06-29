# nadesiko3php

日本語プログラミング言語「なでしこ」をPHPで動かすプロジェクト。
サーバーでの利用を想定。

- [本家「なでしこ3」のリポジトリ](https://github.com/kujirahand/nadesiko3)
- [「なでしこ3」のWEB](https://nadesi.com/)

## インストール方法

なでしこ3エンジンコアは、Node.jsで開発されています。
Node.jsを最初にインストールしておいてください。

```
$ git clone https://github.com/kujirahand/nadesiko3php.git
$ npm install
```

## 使い方

コマンドラインで以下のようなコマンドを実行すると「プログラム.php」というファイルが作成されます。

```
$ phpnako -c (プログラム).nako3
```

作成したプログラム＋本リポジトリのsrcフォルダを同じフォルダに配置するとPHPで実行できます。


