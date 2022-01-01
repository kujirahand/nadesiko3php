const assert = require('assert')
const PHPNako = require('../src/phpnako.js')
const NakoGenPHP = require('../src/nako_gen_php.js')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process');
const iconv = require('iconv-lite')

describe('php_basic_test', () => {
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
  it('print simple', () => {
    cmp('3を表示', '3')
    cmp('A=30;B=20;(A+B)を表示', '50')
  })
  it('replace', () => {
    cmp('「abc#def#ghi」の「#」を「-」に単置換して表示。', 'abc-def#ghi')
    cmp('「  abc  」をトリムして表示', 'abc')
  })
  it('配列カスタムソート', () => {
    cmp('●(A,B)数値順とは\nそれはB-A\nここまで；'+
        'A=[100,30,50]。「数値順」でAを配列カスタムソート;'+
        'AをJSONエンコードして表示。', '[100,50,30]')
    cmp('●(A,B)数値順とは\nそれはA-B\nここまで；'+
        'A=[100,30,50]。「数値順」でAを配列カスタムソート;'+
        'AをJSONエンコードして表示。', '[30,50,100]')
  })
  it('array reverse', () => {
    cmp('A=[1,2,3];Aを配列逆順;AをJSONエンコードして表示。', '[3,2,1]')
  })
  it('表列取得', () => {
    cmp('A=[[1,2,3],[4,5,6],[7,8,9]];Aの1を表列取得してJSONエンコードして表示','[2,5,8]')
  })
  it('表列挿入', () => {
    cmp('A=[[1,2,3],[4,5,6]];Aの1に[0,0]を表列挿入してJSONエンコードして表示',
      '[[1,0,2,3],[4,0,5,6]]')
  })
  it('表列削除', () => {
    cmp('A=[[1,2,3],[4,5,6]];Aの1を表列削除してJSONエンコードして表示',
      '[[1,3],[4,6]]')
  })
  it('表列合計', () => {
    cmp('A=[[1,2,3],[4,5,6]];Aの1を表列合計してJSONエンコードして表示', '7')
  })
  it('表曖昧検索', () => {
    cmp('A=[["ID","名前"],[1,"石鹸"],[2,"シャンプー"]];Aの0から1で「#.+プー#」を表曖昧検索して表示', '2')
  })
  it('表検索', () => {
    cmp('A=[["ID","名前"],[1,"石鹸"],[2,"シャンプー"]];Aの0から1で「石鹸」を表検索して表示', '1')
    cmp('A=[["ID","名前"],[1,"石鹸"],[2,"シャンプー"]];Aの0から1で「hoge」を表検索して表示', '-1')
  })
  it('表正規表現ピックアップ', () => {
    cmp('A=[["ID","名前"],[1,"青森リンゴ"],[2,"青森ミカン"],[3,"静岡ミカン"]];Aの1から「/青森.+/」を表正規表現ピックアップしてJSONエンコードして表示', '[[1,"青森リンゴ"],[2,"青森ミカン"]]')
  })
  it('表ピックアップ', () => {
    cmp('A=[["ID","名前"],[1,"青森リンゴ"],[2,"青森ミカン"],[3,"静岡ミカン"]];Aの1から「青森」を表ピックアップしてJSONエンコードして表示', '[[1,"青森リンゴ"],[2,"青森ミカン"]]')
    cmp('A=[["ID","名前"],[1,"青森リンゴ"],[2,"青森ミカン"],[3,"静岡ミカン"]];Aの1から「青森リンゴ」を表完全一致ピックアップしてJSONエンコードして表示', '[[1,"青森リンゴ"]]')
  })
  it('辞書キー列挙', () => {
    cmp('A={"ID":111,"名前":"なでしこ"};Aの辞書キー列挙してJSONエンコードして表示', '["ID","名前"]')
  })
  it('辞書キー削除', () => {
    cmp('A={"ID":111,"名前":"なでしこ"};Aから"名前"を辞書キー削除してJSONエンコードして表示', '{"ID":111}')
  })
  it('辞書キー存在', () => {
    cmp('A={"ID":111,"名前":"なでしこ"};Aに"名前"が辞書キー存在。それを表示。', '1')
    cmp('A={"ID":111,"名前":"なでしこ"};Aに"F"が辞書キー存在。それを表示。', '0')
  })
  it('URLパラメータ解析', () => {
    cmp('「https://example.com/?a=1&b=2」のURLパラメータ解析してJSONエンコードして表示。', '{"a":"1","b":"2"}')
  })
  it('置換', () => {
    cmp('「a,b,c」の「,」を「-」に置換して表示。', 'a-b-c')
  })
  it('日時処理', () => {
    cmp('(「2022/01/01」の曜日)を表示。', '土')
    cmp('「2022/01/01」の曜日番号取得して表示。', '6')
    cmp('「2022/01/01」を和暦変換して表示。', '令和4年01月01日')
  })
})

