const assert = require('assert')
const PHPNako = require('../src/phpnako.js')
const NakoGenPHP = require('../src/nako_gen_php.js')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process');
const iconv = require('iconv-lite')

describe('plugin_php_test', () => {
  const nako = new PHPNako()
  const cmp = (/** @type {string} */code, /** @type {string} */res) => {
    code = '!"PHP"にモード設定\n' + code
    nako.logger.debug('code=' + code)
    const phpfile = path.join(__dirname, 'tmp.php')
    const txtfile = path.join(__dirname, 'tmp.txt')
    const opt = {
      'filename': path.join(__dirname, 'tmp.nako3'),
      'output': phpfile,
      'run': false
    }
    nako.nakoCompile(opt, code, false)
    const data = execSync(`php "${phpfile}"`)
    const txt = iconv.decode(data, 'utf-8').replace(/\s+$/, '')
    assert.strictEqual(txt, res)
  }
  // --- test ---
  it('HTML埋め込み', () => {
    cmp('「xx[[a]]xx」に{a:20}をHTML埋め込んで表示', 'xx20xx')
    cmp('「xx[[a|raw]]xx」に{a:"<>"}をHTML埋め込んで表示', 'xx<>xx')
    cmp('「xx[[a|%02X]]xx」に{a:255}をHTML埋め込んで表示', 'xxFFxx')
    cmp('「xx[[a|%03d]]xx」に{a:2}をHTML埋め込んで表示', 'xx002xx')
    cmp('「[[a|date]]」に{a:1625138536}をHTML埋め込んで表示', '2021/07/01')
  })
  it('PDO', () => {
    CR=`"sqlite::memory:"のPDO生成;`
    C='「CREATE TABLE tbl(id INTEGER PRIMARY KEY, s TEXT, i INTEGER)」を[]でPDO実行;'
    I1='「INSERT INTO tbl (s,i)VALUES("taro",100)」を[]でPDO実行;'
    I2='「INSERT INTO tbl (s,i)VALUES("jiro",200)」を[]でPDO実行;'
    INIT=`${CR}${C}${I1}${I2}\n`
    cmp(`${INIT}"SELECT * FROM tbl LIMIT 1"を[]でPDO一行取得;それ@"s"を表示。`, 'taro')
    // [メモ] PDOのsqlite3では戻り値は数値も文字列として返ってくる
    cmp(`${INIT}"SELECT i FROM tbl WHERE s=?"を['taro']でPDO全取得;JSONエンコードして表示。`, '[{"i":"100"}]')
    cmp(`${INIT}"SELECT s FROM tbl WHERE i=?"を[200]でPDO全取得;JSONエンコードして表示。`, '[{"s":"jiro"}]')
  })
})

