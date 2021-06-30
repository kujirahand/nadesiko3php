const assert = require('assert')
const PHPNako = require('../src/phpnako.js')
const NakoGenPHP = require('../src/nako_gen_php.js')
const fs = require('fs')
const path = require('path')

describe('php_basic_test', () => {
  const nako = new PHPNako()
  const cmp = (/** @type {string} */code, /** @type {string} */res) => {
    code = '!"PHP"にモード設定\n' + code
    nako.logger.debug('code=' + code)
    const opt = {
      'filename': path.join(__dirname, 'tmp.nako3'),
      'output': path.join(__dirname, 'tmp.js'),
      'run': false
    }
    nako.nakoCompile(opt, code, false)
    // assert.strictEqual(nako.run(code, '').log, res)
  }
  // --- test ---
  it('print simple', () => {
    cmp('3を表示', '3')
  })
})

