/**
 * コマンドライン版のなでしこ3モジュール
 */

// global
import fs from 'fs'
import { execSync } from 'child_process'
import path from 'path'
import fetch from 'node-fetch'
import iconv from 'iconv-lite'
import chokidar from 'chokidar'

// nadesiko3
import { NakoCompiler } from 'nadesiko3/core/src/nako3.mjs'
import { NakoImportError } from 'nadesiko3/core/src/nako_errors.mjs'
import app from 'nadesiko3/src/commander_ja.mjs'
import nako_version from 'nadesiko3/src/nako_version.mjs'

// this repository
import { NakoGenPHP } from './nako_gen_php.js'

import url from 'url'
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// read plugins
const PluginSystem = JSON.parse(fs.readFileSync(path.join(__dirname, 'plugin_system.php.json')))
const PluginNode = JSON.parse(fs.readFileSync(path.join(__dirname, 'plugin_node.php.json')))
const PluginPHP = JSON.parse(fs.readFileSync(path.join(__dirname, 'plugin_php.php.json')))
const PluginMath = JSON.parse(fs.readFileSync(path.join(__dirname, 'plugin_math.php.json')))

/** PHPNako */
export class PHPNako extends NakoCompiler {
  /** @param {{ nostd?: boolean }} [opts] */
  constructor (opts = {}) {
    super({useBasicPlugin: false})
    this.addCodeGenerator('PHP', NakoGenPHP) // 「!PHP」をサポート
    this.silent = false
    this.addPluginObject('plugin_system', PluginSystem)
    this.addPluginObject('plugin_node', PluginNode)
    this.addPluginObject('plugin_php', PluginPHP)
    this.addPluginObject('plugin_math', PluginMath)
    this.__varslist[0]['ナデシコ種類'] = 'phpnako'
  }

  // phpnakoで使えるコマンドを登録する
  registerCommands () {
    // コマンド引数がないならば、ヘルプを表示(-hはcommandarにデフォルト用意されている)
    if (process.argv.length <= 2)
      {process.argv.push('-h')}

    // commanderを使って引数を解析する
    app
      .title('日本語プログラミング言語「なでしこ3PHP」v' + nako_version.version)
      .version(nako_version.version, '-v, --version')
      .usage('[オプション] 入力ファイル.nako3')
      .option('-w, --warn', '警告を表示する')
      .option('-d, --debug', 'デバッグモードの指定')
      .option('-D, --trace', '詳細デバッグモードの指定')
      .option('-c, --compile', 'コンパイルモードの指定')
      .option('-t, --test', 'コンパイルモードの指定 (テスト用コードを出力)')
      .option('-r, --run', 'コンパイルモードでも実行する')
      .option('-e, --eval [src]', '直接プログラムを実行するワンライナーモード')
      .option('-o, --output', '出力ファイル名の指定')
      .option('-s, --silent', 'サイレントモードの指定')
      .option('-l, --repl', '対話シェル(REPL)の実行')
      .option('-p, --speed', 'スピード優先モードの指定')
      .option('-A, --ast', 'パースした結果をASTで出力する')
      .option('-r, --dir [dir]', '指定したフォルダにあるファイルを全部変換する')
      .option('-W, --watch', '作業フォルダのファイルを監視して順次コンパイルする')
      // .option('-h, --help', '使い方を表示する')
      // .option('-v, --version', 'バージョンを表示する')
      .parse(process.argv)
    return app
  }

  /**
   * コマンドライン引数を解析
   * @returns {{warn: boolean, debug: boolean, compile: any | boolean, test: any | boolean, one_liner: any | boolean, trace: any, run: any | boolean, repl: any | boolean, source: any | string}}
   */
  checkArguments () {
    const app = this.registerCommands()

    /** @type {import('./nako_logger').LogLevel} */
    let logLevel = 'error'
    if (app.trace) {
      logLevel = 'trace'
    } else if (app.debug) {
      logLevel = 'debug'
    } else if (app.warn) {
      logLevel = 'warn'
    }
    this.logger.addListener(logLevel, ({ level, nodeConsole }) => {
      if (this.silent && level === 'stdout') {
        return
      }
      console.log(nodeConsole)
    })

    let args = {
      'compile': app.compile || false,
      'run': app.run || false,
      'source': app.eval || '',
      'man': app.man || '',
      'one_liner': app.eval || false,
      'debug': this.debug,
      'trace': app.trace,
      'warn': app.warn,
      'repl': app.repl || false,
      'test': app.test || false,
      'browsers': app.browsers || false,
      'speed': app.speed || false,
      'ast': app.ast || false,
      'dir': app.dir || false,
      'watch': app.watch || false
    }
    args.mainfile = app.args[0]
    args.output = app.output
    if (/\.(nako|nako3|txt|bak)$/.test(args.mainfile)) {
      if (!args.output) {
        if (args.test) {
          args.output = args.mainfile.replace(/\.(nako|nako3)$/, '.spec.php')
        } else {
          args.output = args.mainfile.replace(/\.(nako|nako3)$/, '.php')
        }
      }
    } else {
      if (!args.output) {
        if (args.test) {
          args.output = args.mainfile + '.spec.php'
        } else {
          args.output = args.mainfile + '.php'
        }
      }
      if (args.mainfile) {
        args.mainfile += '.nako3'
      }
    }
    return args
  }

  // 実行する
  execCommand () {
    const opt = this.checkArguments()
    if (opt.repl) { // REPLを実行する
      this.cnakoRepl(opt)
      return
    }
    if (opt.one_liner) { // ワンライナーで実行する
      this.cnakoOneLiner(opt)
      return
    }
    if (opt.dir) { // フォルダを全部変換する
      this.convertDir(opt)
      return
    }
    if (opt.watch) { // 監視して変換する
      this.watch(opt)
      return
    }
    if (opt.mainfile === undefined) {
      console.log(app.getHelp())
      return
    }
    execMainfile(opt)
  }

  execMainfile (opt) {
    if (opt.mainfile) {this.filename = path.basename(opt.mainfile) }
    // メインプログラムを読み込む
    let src = fs.readFileSync(opt.mainfile, 'utf-8')
    if (opt.compile) {
      this.nakoCompile(opt, src, false)
      return
    }
    if (opt.ast) {
      this.outputAST(opt, src)
      return
    }
    // 実行
    opt.run = true
    this.nakoCompile(opt, src, false)
  }

  /**
   * コンパイルモードの場合
   * @param opt
   * @param {string} src
   * @param {boolean} isTest
   */
  nakoCompile(opt, src, isTest) {
    // system
    src = '!"PHP"をモード設定; ' + src
    try {
      const jscode = this.compileStandalone(src, this.filename, isTest)
      fs.writeFileSync(opt.output, jscode, 'utf-8')
    } catch (e) {
      console.warn(e.message)
    }
    // プラグインPHPがあるかチェック
    this.copyRuntime(opt.output)
    if (opt.run) {
      const res = execSync(`php ${opt.output}`);
      const txt = iconv.decode(res, 'utf-8').replace(/\s+$/, '')
      console.log(txt)
    }
  }
  /**
   * ランタイムのコピー
   */
  copyRuntime(targetFile) {
    const targetDir = path.dirname(path.resolve(targetFile))
    const targetSrcDir = path.join(targetDir, 'src')
    const srcDir = path.join(path.resolve(__dirname))
    if (targetSrcDir == srcDir) {return}
    // フォルダ作成
    if (!fs.existsSync(targetSrcDir)) {fs.mkdirSync(targetSrcDir)}
    const files = fs.readdirSync(srcDir)
    for (const name of files) {
      if (!name.match(/^plugin_.*\.php$/)) {continue}
      const src = path.join(srcDir, name)
      const dst = path.join(targetSrcDir, name)
      fs.copyFileSync(src, dst) // 強制的に上書き
    }
    // nako3config.ini.php がある？ (なければ作成)
    const configFile = path.join(srcDir, 'nako3config.ini.tpl')
    const targetConfigFile = path.join(targetDir, 'nako3config.ini.php')
    if (!fs.existsSync(targetConfigFile)) {
      fs.copyFileSync(configFile, targetConfigFile)
    }
  }

  // ワンライナーの場合
  cnakoOneLiner (opt) {
    // テンポラリフォルダを作成
    const tempDir = path.join(path.dirname(__dirname), 'tmp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
    }
    this.filename = opt.filename = path.join(tempDir, 'oneliner.nako3')
    opt.output = path.join(tempDir, 'oneliner.php')
    opt.run = true
    this.nakoCompile(opt, opt.source, false)
  }

  /**
   * ASTを出力
   * @param opt
   * @param {string} src
   * @param {boolean} isTest
   */
   outputAST(opt, src) {
    const ast = this.parse(src, opt.mainfile)
    const makeIndent = (level) => {
      let s = ''
      for (let i = 0; i < level; i++) {s += '  '}
      return s
    }
    const trim = (s) => { return s.replace(/(^\s+|\s+$)/g, '')}
    /**
     * AST文字列に変換して返す
     * @param {*} ast 
     * @param {number} level 
     * @return {string}
     */
    const outAST = (ast, level) => {
      if (typeof(ast) === 'string') {
        return makeIndent(level) + '"' + ast + '"';
      }
      if (typeof(ast) === 'number') {
        return makeIndent(level) + ast;
      }
      if (ast instanceof Array) {
        let s = makeIndent(level) + '[\n'
        const sa = []
        ast.forEach((a) => {
          sa.push(outAST(a, level+1))
        })
        return s + sa.join(',\n') + '\n' + makeIndent(level) + ']'
      }
      if (ast instanceof Object) {
        let s = makeIndent(level) + '{\n'
        const sa = []
        for (let key in ast) {
          const sv = trim(outAST(ast[key], level+1))
          const so = makeIndent(level+1) + '"' + key + '": ' + sv
          sa.push(so)
        }
        return s + sa.join(',\n') + '\n' + makeIndent(level) + '}'
      }
      return makeIndent(level) + ast
    }
    console.log(outAST(ast, 0))
  }

  // REPL(対話実行環境)の場合
  cnakoRepl (opt) {
    const fname = path.join(__dirname, 'repl.nako3')
    const src = fs.readFileSync(fname, 'utf-8')
    this.run(src, true)
  }

  /**
   * @param {string} code
   * @param {string} filename
   * @param {string} preCode
   */
  loadDependencies(code, filename, preCode) {
    /** @type {string[]} */
    const log = []
    // 同期的に読み込む
    const tasks = super._loadDependencies(code, filename, preCode, {
      resolvePath: (name, token) => {
        if (/\.js(\.txt)?$/.test(name) || /^[^\.]*$/.test(name)) {
          return { filePath: path.resolve(PHPNako.findPluginFile(name, this.filename, __dirname, log)), type: 'js' }
        }
        if (/\.nako3?(\.txt)?$/.test(name)) {
          if (path.isAbsolute(name)) {
            return { filePath: path.resolve(name), type: 'nako3' }
          } else {
            // filename が undefined のとき token.file が undefined になる。
            if (token.file === undefined) {
              throw new Error('ファイル名を指定してください。')
            }
            return { filePath: path.resolve(path.join(path.dirname(token.file), name)), type: 'nako3' }
          }
        }
        return { filePath: name, type: 'invalid' }
      },
      readNako3: (name, token) => {
        if (!fs.existsSync(name)) {
          throw new NakoImportError(`ファイル ${name} が存在しません。`, token.line, token.file)
        }
        return { sync: true, value: fs.readFileSync(name).toString()}
      },
      readJs: (name, token) => {
        return {
          sync: true,
          value: () => {
            try {
              return JSON.parse(fs.readFileSync(name))
            } catch (/** @type {unknown} */err) {
              let msg = `プラグイン ${name} の取り込みに失敗: ${err instanceof Error ? err.message : err + ''}`
              if (err instanceof Error && err.message.startsWith('Cannot find module')) {
                msg += `\n次の場所を検索しました: ${log.join(', ')}`
              }
              throw new NakoImportError(msg, token.line, token.file)
            }
          },
        }
      },
    })
    if (tasks !== undefined) {
      throw new Error('assertion error')
    }
  }

  /**
   * @param {string} code
   * @param {string} fname
   * @param {string} [preCode]
   */
  run (code, fname, preCode = '') {
    if (preCode == '') {
      preCode = '!"PHP"にモード設定\n'
      code = preCode + code
    } 
    const tasks = this.loadDependencies(code, fname, preCode)
    if (tasks !== undefined) {
      throw new Error('assertion error')
    }
    // compile
    this.compileStandalone(code, filename, false, preCode)
    return this._runEx(code, fname, {}, preCode)
  }

  /** フォルダ内の全てを変換する */
  convertDir (opt) {
    const dir = opt.dir || '.'
    const files = fs.readdirSync(dir)
    for (const f of files) {
      if (f.match(/\.nako3$/)) {
        const fpath = path.join(dir, f)
        console.log(`*** conv: ${f}`)
        const cmd = `node "${__dirname}/phpnako.js" -c "${fpath}"`
        try {
          execSync(cmd)
        } catch (e) {
          console.error(e)
        }
      }
    }
    console.log('ok')
  }

  /** 監視して変換する */
  watch (opt) {
    const conv = (fpath) => {
      const f = path.basename(fpath)
      if (!f.match(/\.nako3$/)) { return }
      console.log(`*** conv: ${fpath}`)
      const cmd = `node "${__dirname}/phpnako.js" -c "${fpath}"`
      try {
        execSync(cmd)
      } catch (e) {
        console.error(e)
      }
    }
    const dir = process.cwd()
    const ww = chokidar.watch(dir, {
      ignored: /[\/\\]\./,
      persistent: true
    })
    // 最初に全部変換
    this.convertDir(dir)
    ww.on('ready', () => {
      console.log('*** フォルダを監視します:')
      ww.on('add', (fpath) => conv(fpath))
      ww.on('change', (fpath) => conv(fpath))
    })
  }
}
