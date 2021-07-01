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
  it('単純なシステム関数の呼出', () => {
    cmp('「abc#def#ghi」の「#」を「-」に単置換して表示。', 'abc-def#ghi')
    cmp('「  abc  」をトリムして表示', 'abc')
  })
  it('ユーザー関数の呼出', () => {
    cmp('●(AとBを)合計処理とは\nそれはA+B;\nここまで。3と5を合計処理して表示。', '8')
    cmp('●合計処理(AとBを)\nそれはA+B;\nここまで。合計処理(3,5)を表示。', '8')
  })
  it('繰り返し', () => {
    cmp('A=0;10回,A=A+回数。Aを表示。', '55')
    cmp('A=0;Nを0から10まで繰り返す\nA=A+N💧Aを表示。', '55')
    cmp('A=0;N=10;Nが0以上の間繰り返す\nA=A+N;N=N-1;💧Aを表示。', '55')
    cmp('A=0;N=[1,2,3,4,5,6,7,8,9,10];Nを反復\nA=A+対象;💧Aを表示。', '55')
  })
  it('関数の再帰呼出', () => {
    cmp('A=0;●(Nの)再帰処理\nもしN<0ならば、0で戻る。A=A+N;(N-1)の再帰処理。💧;10の再帰処理;Aを表示。', '55')
  })
  it('配列カスタムソート', () => {
    cmp('●(A,B)数値順とは\nそれはB-A\nここまで；'+
        'A=[100,30,50]。「数値順」でAを配列カスタムソート;'+
        'AをJSONエンコードして表示。', '[100,50,30]')
    cmp('●(A,B)数値順とは\nそれはA-B\nここまで；'+
        'A=[100,30,50]。「数値順」でAを配列カスタムソート;'+
        'AをJSONエンコードして表示。', '[30,50,100]')
  })
})

