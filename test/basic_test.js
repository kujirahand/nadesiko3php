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
  })
})

