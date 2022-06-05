/**
 * file: nako_gen.js
 * パーサーが生成した中間オブジェクトを実際のPHPのコードに変換する。
 */

import path from 'path'
import { NakoSyntaxError, NakoError, NakoRuntimeError } from 'nadesiko3/core/src/nako_errors.mjs'
import nakoVersion from 'nadesiko3/src/nako_version.mjs'
import { NakoGen } from 'nadesiko3/core/src/nako_gen.mjs'

/**
 * @typedef {import("./nako3").Ast} Ast
 */
/**
 * 構文木からJSのコードを生成するクラス
 */
export class NakoGenPHP {
  /**
   * @param {import('./nako3')} com
   * @param {Ast} ast
   * @param {boolean | string} isTest 文字列なら1つのテストだけを実行する
   */
  static generate(com, ast, isTest) {
    const gen = new NakoGenPHP(com)

    // ユーザー定義関数をシステムに登録する
    gen.registerFunction(ast)

    // PHPコードを生成する
    let php = gen.convGen(ast, !!isTest)

    // JSコードを実行するための事前ヘッダ部分の生成
    let head = gen.getDefFuncCode(isTest)

    // テストの実行
    if (php && isTest) {
      // TODO: テストコード
      // php += '\n__self._runTests(__tests);\n'
    }
    const modName = path.basename(com.filename).replace(/\.[a-z0-9]+$/, '')
    const code = `<?php
    //-----------------------------------------------
    // 【なでしこ3PHP】「${com.filename}」から自動生成されたコード
    //-----------------------------------------------
    // global 設定
    global $nako3, $__v0, $__v1, $__v2, $__locals;
    if (empty($nako3)) {
      // init basic object
      $nako3 = [
        'version' => '${nakoVersion.version}',
        '__varslist'=> [[], [], []], // 変数リスト
        '__module' => [], // モジュールデータ
        '__genMode' => 'PHP',
        'modName' => '${modName}',
      ];
      // alias
      $__v0 = &$nako3['__varslist'][0]; // system
      $__v1 = &$nako3['__varslist'][1]; // user global
      $__v2 = &$nako3['__varslist'][2]; // user vars
      $__locals = &$__v2; // stack top
    }
    //-----------------------------------------------
    // 基本設定のインポート
    if (file_exists(__DIR__.'/nako3config.ini.php')) {
      require_once __DIR__.'/nako3config.ini.php';
    }
    //-----------------------------------------------
    // 各種宣言
    ${gen.getVarsCode()}
    //-----------------------------------------------
    // ヘッダ
    ${head}
    // パスなどの設定
    $__v0['母艦パス'] = __DIR__;
    $nako3['modName'] = '${modName}';
    //-----------------------------------------------
    // 変換コード
    try {
    ${php}
    } catch (Exception $err) {
        $ninfo = $nako3['__varslist'][0]['line'];
        echo "<pre> [PHP実行時エラー] ($ninfo)\n";
        print_r($err);
    }
    //-----------------------------------------------
    `
    // デバッグメッセージ
    const codeLines = code.split('\n').map((line, no) => `${no+1}: ${line}`).join('\n')
    com.logger.trace('--- generate::PHP ---\n' + codeLines)

    return {
      runtimeEnv: php,  // なでしこの実行環境ありの場合
      standalone: code, // JavaScript単体で動かす場合
      gen,  // コード生成に使ったNakoGenのインスタンス
    }
  }

  /**
   * @param {import('./nako3')} com コンパイラのインスタンス
   */
  constructor (com) {
    /**
     * 出力するJavaScriptコードのヘッダー部分で定義する必要のある関数。fnはjsのコード。
     * プラグイン関数は含まれない。
     */
    this.nako_func = { ...com.nako_func }

    /**
     * なでしこで定義したテストの一覧
     * @type {Record<string, { josi: string[][], fn: string, type: 'test_func' }>}
     */
    this.nako_test = {}

    /**
     * プログラム内で参照された関数のリスト。プラグインの命令を含む。
     * JavaScript単体で実行するとき、このリストにある関数の定義をJavaScriptコードの先頭に付け足す。
     * @type {Set<string>}
     */
    this.used_func = new Set()

    /**
     * ループ時の一時変数が被らないようにIDで管理
     * @type {number}
     */
    this.loop_id = 1

    /**
     * 変換中の処理が、ループの中かどうかを判定する
     * @type {boolean}
     */
    this.flagLoop = false

    this.__self = com

    /**
     * コードジェネレータの種類
     * @type {string}
     */
     this.genMode = 'PHP'

    /**
     * 行番号とファイル名が分かるときは `l123:main.nako3`、行番号だけ分かるときは `l123`、そうでなければ任意の文字列。
     * @type {string | null}
     */
    this.lastLineNo = null

    /**
     * スタック
     * @type {{ isFunction: boolean, names: Set<string>, readonly: Set<string> }[]}
     */
    this.varslistSet = com.__varslist.map((v) => ({ isFunction: false, names: new Set(Object.keys(v)), readonly: new Set() }))

    /**
     * スタックトップ
     * @type {{ isFunction: boolean, names: Set<string>, readonly: Set<string> }}
     */
    this.varsSet = { isFunction: false, names: new Set(), readonly: new Set() }
    this.varslistSet[2] = this.varsSet

    // 1以上のとき高速化する。
    // 実行速度優先ブロック内で1増える。
    this.speedMode = {
      lineNumbers: 0,          // 行番号を出力しない
      implicitTypeCasting: 0,  // 数値加算でparseFloatを出力しない
      invalidSore: 0,          // 「それ」を用いない
      forcePure: 0,            // 全てのシステム命令をpureとして扱う。命令からローカル変数への参照が出来なくなる。
    }

    // 1以上のとき測定をinjectする。
    // パフォーマンスモニタのブロック内で1増える。
    this.performanceMonitor = {
      userFunction: 0,         // 呼び出されたユーザ関数
      systemFunction: 0,       // システム関数(呼び出しコードを含む)
      systemFunctionBody: 0,   // システム関数(呼び出しコードを除く)
    }
  }

  /**
   * @param {import("./nako3").Ast} node
   * @param {boolean} forceUpdate
   */
  convLineno (node, forceUpdate) {
    if (this.speedMode.lineNumbers > 0) { return '' }

    /** @type {string} */
    let lineNo
    if (typeof node.line !== 'number') {
      lineNo = 'unknown'
    } else if (typeof node.file !== 'string') {
      lineNo = `l${node.line}`
    } else {
      lineNo = `l${node.line}:${node.file}`
    }

    // 強制的に行番号をアップデートするか
    if (!forceUpdate) {
      if (lineNo == this.lastLineNo) return ''
      this.lastLineNo = lineNo
    }
    // 例: __v0.line='l1:main.nako3'
    return `$__v0['line']=${JSON.stringify(lineNo)};`
  }

  /**
   * ローカル変数のJavaScriptコードを生成する。
   * @param {string} name
   */
  varname (name) {
    // 関数の中かどうか
    if (this.varslistSet.length === 3) {
      // グローバル
      return `$__v2[${JSON.stringify(name)}]`
    } else {
      // 関数内
      return `$__locals[${JSON.stringify(name)}]`
    }
  }

  /** @param {string} name */
  static getFuncName (name) {
    let name2 = name.replace(/[ぁ-ん]+$/, '')
    if (name2 === '') {name2 = name}
    return name2
  }

  /** @param {Ast} node */
  static convPrint (node) {
    return `__print(${node});`
  }

  /**
   * プログラムの実行に必要な関数を書き出す(システム領域)
   * @returns {string}
   */
  getVarsCode () {
    let code = ''
    return code
  }

  /**
   * プログラムの実行に必要な関数定義を書き出す(グローバル領域)
   * convGenの結果を利用するため、convGenの後に呼び出すこと。
   * @param {boolean | string} isTest テストかどうか。stringの場合は1つのテストのみ。
   * @returns {string}
   */
  getDefFuncCode (isTest) {
    let code = ''
    // なでしこの関数定義を行う
    let nakoFuncCode = ''
    for (const key in this.nako_func) {
      const f = this.nako_func[key].fn
      nakoFuncCode += '' +
        `//[DEF_FUNC name='${key}']\n` +
        `$__v1["${key}"]=${f};\n;` +
        `//[/DEF_FUNC name='${key}']\n`
    }
    if (nakoFuncCode !== '')
      {code += `$nako3['__varslist'][0]['line']=\'関数の定義\';\n` + nakoFuncCode}

    // プラグインの初期化関数を実行する
    for (const name in this.__self.__module) {
      code += this.convRequire(name)
    }
    return code
  }

  /**
   * プラグイン・オブジェクトを追加
   * @param po プラグイン・オブジェクト
   */
  addPlugin (po) {
    return this.__self.addPlugin(po)
  }

  /**
   * プラグイン・オブジェクトを追加(ブラウザ向け)
   * @param name オブジェクト名
   * @param po 関数リスト
   */
  addPluginObject (name, po) {
    this.__self.addPluginObject(name, po)
  }

  /**
   * プラグイン・ファイルを追加(Node.js向け)
   * @param objName オブジェクト名
   * @param path ファイルパス
   * @param po 登録するオブジェクト
   */
  addPluginFile (objName, path, po) {
    this.__self.addPluginFile(objName, path, po)
  }

  /**
   * 関数を追加する
   * @param key 関数名
   * @param josi 助詞
   * @param fn 関数
   */
  addFunc (key, josi, fn) {
    this.__self.addFunc(key, josi, fn)
  }

  /**
   * 関数をセットする
   * @param key 関数名
   * @param fn 関数
   */
  setFunc (key, fn) {
    this.__self.setFunc(key, fn)
  }

  /**
   * プラグイン関数を参照する
   * @param key プラグイン関数の関数名
   * @returns プラグイン・オブジェクト
   */
  getFunc (key) {
    return this.__self.getFunc(key)
  }

  /**
   * 関数を先に登録してしまう
   */
  registerFunction (ast) {
    if (ast.type !== 'block')
      {throw NakoSyntaxError.fromNode('構文解析に失敗しています。構文は必ずblockが先頭になります', ast)}

    const registFunc = (node) => {
      for (let i = 0; i < node.block.length; i++) {
        const t = node.block[i]
        if (t.type === 'def_func') {
          const name = t.name.value
          this.used_func.add(name)
          this.__self.__varslist[1][name] = function () { } // 事前に適当な値を設定
          this.nako_func[name] = {
            josi: t.name.meta.josi,
            fn: '',
            type: 'func'
          }
        } else
        if (t.type === 'speed_mode') {
          if (t.block.type === 'block') {
            registFunc(t.block)
          } else {
            registFunc(t)
          }
        } else
        if (t.type === 'performance_monitor') {
          if (t.block.type === 'block') {
            registFunc(t.block)
          } else {
            registFunc(t)
          }
        }
      }
    }
    registFunc(ast)

    // __self.__varslistの変更を反映
    const initialNames = new Set()
    if (this.speedMode.invalidSore === 0) {
      initialNames.add('それ')
    }
    this.varsSet = { isFunction: false, names: initialNames, readonly: new Set() }
    this.varslistSet = this.__self.__varslist.map((v) => ({ isFunction: false, names: new Set(Object.keys(v)), readonly: new Set() }))
    this.varslistSet[2] = this.varsSet
  }

  /**
   * @param {Ast} node
   * @param {boolean} isTest
   */
   convGen (node, isTest) {
    const result = this.convLineno(node, false) + this._convGen(node, true)
    if (isTest) {
      return ''
    } else {
      return result
    }
  }

  /**
   * @param {Ast} node
   * @param {boolean} isExpression
   */
  _convGen (node, isExpression) {
    let code = ''
    if (node instanceof Array) {
      for (let i = 0; i < node.length; i++) {
        const n = node[i]
        code += this._convGen(n, isExpression)
      }
      return code
    }
    if (node === null) {return 'null'}
    if (node === undefined) {return 'null'}
    if (typeof (node) !== 'object') {return '' + node}
    // switch
    switch (node.type) {
      case 'nop':
        break
      case 'block':
        for (let i = 0; i < node.block.length; i++) {
          const b = node.block[i]
          code += this._convGen(b, false)
        }
        break
      case 'comment':
      case 'eol':
        code += this.convComment(node)
        break
      case 'break':
        code += this.convCheckLoop(node, 'break')
        break
      case 'continue':
        code += this.convCheckLoop(node, 'continue')
        break
      case 'end':
        code += '$__v0[\'終\']($nako3);'
        break
      case 'number':
        code += node.value
        break
      case 'string':
        code += this.convString(node)
        break
      case 'def_local_var':
        code += this.convDefLocalVar(node)
        break
      case 'def_local_varlist':
        code += this.convDefLocalVarlist(node)
        break
      case 'let':
        code += this.convLet(node)
        break
      case 'word':
      case 'variable':
        code += this.convGetVar(node)
        break
      case 'op':
      case 'calc':
        code += this.convOp(node)
        break
      case 'renbun':
        code += this.convRenbun(node)
        break
      case 'not':
        code += '((' + this._convGen(node.value, true) + ')?0:1)'
        break
      case 'func':
      case 'func_pointer':
      case 'calc_func':
        code += this.convFunc(node, isExpression)
        break
      case 'if':
        code += this.convIf(node)
        break
      case 'tikuji':
        code += this.convTikuji(node)
        break
      case 'for':
        code += this.convFor(node)
        break
      case 'foreach':
        code += this.convForeach(node)
        break
      case 'repeat_times':
        code += this.convRepeatTimes(node)
        break
      case 'speed_mode':
        code += this.convSpeedMode(node, isExpression)
        break
      case 'performance_monitor':
        code += this.convPerformanceMonitor(node, isExpression)
        break
      case 'while':
        code += this.convWhile(node)
        break
      case 'switch':
        code += this.convSwitch(node)
        break
      case 'let_array':
        code += this.convLetArray(node)
        break
      case '配列参照':
        code += this.convRefArray(node)
        break
      case 'json_array':
        code += this.convJsonArray(node)
        break
      case 'json_obj':
        code += this.convJsonObj(node)
        break
      case 'func_obj':
        code += this.convFuncObj(node)
        break
      case 'bool':
        code += (node.value) ? 'true' : 'false'
        break
      case 'null':
        code += 'null'
        break
      case 'def_test':
        code += this.convDefTest(node)
        break
      case 'def_func':
        code += this.convDefFunc(node)
        break
      case 'return':
        code += this.convReturn(node)
        break
      case 'try_except':
        code += this.convTryExcept(node)
        break
      case 'require':
        // 既に取り込んでいる
        break
      default:
        throw new Error('System Error: unknown_type=' + node.type)
    }
    return code
  }

  /**
   * require を変換する
   * @param {string} mod 
   * @returns 
   */
  convRequire (mod) {
    return `
    // <require_once src="${mod}">
    // 取り込むファイルのパスを解決
    $mod_file = __DIR__.'/src/${mod}.php';
    if (defined('PHPNAKO_RUNTIME_PATH')) {
      $mod_file = PHPNAKO_RUNTIME_PATH.'/${mod}.php';
    }
    if (empty($nako3['__module']['${mod}'])) {
      require_once $mod_file;
      $nako3['__module']['${mod}'] = $exports;
      foreach ($exports as $name => $v) { // import to v0
        if ($v['type'] == 'func') { $__v0[$name] = $v['fn']; }
        else { $__v0[$name] = $v['value']; }
      }
      // 初期化メソッドを実行
      if (!empty($exports['初期化'])) { $exports['初期化']['fn']($nako3); }
    }
    // </require_once>
    `
  }

  /**
   * @param {string} name
   * @returns {{i: number, name: string, isTop: boolean, js: string} | null}
   */
  findVar (name) {
    // __vars ? (ローカル変数)
    if (this.varslistSet.length > 3 && this.varsSet.names.has(name)) {
      return { i: this.varslistSet.length - 1, name, isTop: true, js: this.varname(name) }
    }
    // __varslist ?
    for (let i = 2; i >= 0; i--) {
      if (this.varslistSet[i].names.has(name)) {
        // ユーザーの定義したグローバル変数 (__varslist[2]) は、変数展開されている（そのままの名前で定義されている）可能性がある。
        // それ以外の変数は、必ず__varslistに入っている。
        if (i == 0) {
          return { i, name, isTop: false, js: `$__v0[${JSON.stringify(name)}]` }
        }
        if (i == 1) {
          return { i, name, isTop: false, js: `$__v1[${JSON.stringify(name)}]` }
        }
        if (i == 2) {
          return { i, name, isTop: false, js: `$__v2[${JSON.stringify(name)}]` }
        }
        return { i, name, isTop: false, js: `$nako3['__varslist'][${i}][${JSON.stringify(name)}]` }
      }
    }
    
    return null
  }

  /**
   * 定義済みの変数の参照
   * @param {string} name
   * @param {Ast} position
   */
  genVar (name, position) {
    const res = this.findVar(name)
    const lno = position.line
    if (res === null) {
      // 定義されていない名前の参照は変数の定義とみなす。
      // 多くの場合はundefined値を持つ変数であり分かりづらいバグを引き起こすが、
      // 「ナデシコする」などの命令の中で定義された変数の参照の場合があるため警告に留める。
      // ただし、自動的に定義される変数『引数』『それ』などは例外 #952
      if (name == '引数' || name == 'それ' || name == '対象' || name == '対象キー') {
        // デフォルト定義されている変数名
      } else {
        this.__self.logger.warn(`変数『${name}』は定義されていません。`, position)
      }
      this.varsSet.names.add(name)
      return this.varname(name)
  }

    const i = res.i
    // システム関数・変数の場合
    if (i === 0) {
      const pv = this.__self.funclist[name]
      if (!pv) {return `${res.js}/*err:${lno}*/`}
      if (pv.type === 'const' || pv.type === 'var') {return res.js}
      if (pv.type === 'func') {
        if (pv.josi.length === 0)
          {return `(${res.js}())`}

        throw NakoSyntaxError.fromNode(`『${name}』が複文で使われました。単文で記述してください。(v1非互換)`, position)
      }
      throw NakoSyntaxError.fromNode(`『${name}』は関数であり参照できません。`, position)
    }
    return res.js
  }

  convGetVar (node) {
    const name = node.value
    return this.genVar(name, node)
  }

  convComment (node) {
    let commentSrc = String(node.value)
    commentSrc = commentSrc.replace(/\n/g, '¶')
    const lineNo = this.convLineno(node, false)
    if (commentSrc === '' && lineNo === '') { return ';' }
    if (commentSrc === '') {
      return ';' + lineNo + '\n'
    }
    return ';' + lineNo + '//' + commentSrc + '\n'
  }

  convReturn (node) {
    // 関数の中であれば利用可能
    if (this.varsSet.names.has('!関数'))
      {throw NakoSyntaxError.fromNode('『戻る』がありますが、関数定義内のみで使用可能です。', node)}

    const lno = this.convLineno(node, false)
    let value
    if (node.value) {
      value = this._convGen(node.value, true)
      return lno + `return ${value};`
    } else
    if (this.speedMode.invalidSore === 0) {
      return lno + `return ${this.varname('それ')};`
    } else {
      return lno + 'return;'
    }
  }

  convCheckLoop (node, cmd) {
    // ループの中であれば利用可能
    if (!this.flagLoop) {
      const cmdj = (cmd === 'continue') ? '続ける' : '抜ける'
      throw NakoSyntaxError.fromNode(`『${cmdj}』文がありますが、それは繰り返しの中で利用してください。`, node)
    }
    return this.convLineno(node.line) + cmd + ';'
  }

  convDefFuncCommon (node, name) {
    let topOfFunction = '(function(){\nglobal $nako3, $__v0, $__v1, $__v2;\n'
    let endOfFunction = '})'
    let variableDeclarations = ''
    const initialNames = new Set()
    if (this.speedMode.invalidSore === 0) {
      initialNames.add('それ')
    }
    this.varsSet = { isFunction: true, names: initialNames, readonly: new Set() }
    // ローカル変数をPUSHする
    this.varslistSet.push(this.varsSet)
    // JSの引数と引数をバインド
    // variableDeclarations += `  $__vars['引数'] = arguments;\n`
    // 宣言済みの名前を保存
    const varsDeclared = Array.from(this.varsSet.names.values())
    let code = ''
    // 引数をローカル変数に設定
    let meta = (!name) ? node.meta : node.name.meta
    for (let i = 0; i < meta.varnames.length; i++) {
      const word = meta.varnames[i]
      code += `  ${this.varname(word)} = func_get_arg(${i});\n`
      this.varsSet.names.add(word)
    }
    // 関数定義は、グローバル領域で。
    if (name) {
      this.used_func.add(name)
      this.varslistSet[1].names.add(name)
      this.nako_func[name] = {
        josi: node.name.meta.josi,
        fn: '',
        type: 'func'
      }
    }
    // ブロックを解析
    const block = this._convGen(node.block, false)
    code += block.split('\n').map((line) => '  ' + line).join('\n') + '\n'
    // 関数の最後に、変数「それ」をreturnするようにする
    if (this.speedMode.invalidSore === 0) {
      code += `  return (${this.varname('それ')});\n`
    }
    // 関数の末尾に、ローカル変数をPOP
    code += endOfFunction

    variableDeclarations += `  $__locals = ['それ'=>''];\n`
    code = topOfFunction + variableDeclarations + code

    if (name)
      {this.nako_func[name].fn = code}

    this.varslistSet.pop()
    this.varsSet = this.varslistSet[this.varslistSet.length - 1]
    if (name)
      {this.__self.__varslist[1][name] = code}

    return code
  }

  convDefTest(node) {
    const name = node.name.value
    let code = `__tests.push([ 'name' => '${name}', 'f' => function() {\n`

    // ブロックを解析
    const block = this._convGen(node.block, false)

    code += `   ${block}\n` +
      `}]);`

    this.nako_test[name] = {
      'josi': node.name.meta.josi,
      'fn': code,
      'type': 'test_func'
    }

    // ★この時点ではテストコードを生成しない★
    // プログラム冒頭でコード生成時にテストの定義を行う
    return ''
  }

  convDefFunc(node) {
    const name = NakoGen.getFuncName(node.name.value)
    this.convDefFuncCommon(node, name)
    // ★この時点では関数のコードを生成しない★
    // プログラム冒頭でコード生成時に関数定義を行う
    return ''
  }

  convFuncObj (node) {
    return this.convDefFuncCommon(node, '')
  }

  convJsonObj (node) {
    const list = node.value
    const codelist = list.map((e) => {
      const key = this._convGen(e.key, true)
      const val = this._convGen(e.value, true)
      return `${key} => ${val}`
    })
    return '[' + codelist.join(',') + ']'
  }

  convJsonArray (node) {
    const list = node.value
    const codelist = list.map((e) => {
      return this._convGen(e, true)
    })
    return '[' + codelist.join(',') + ']'
  }

  convRefArray(node) {
    const name = this._convGen(node.name, true)
    const list = node.index
    let code = name
    for (let i = 0; i < list.length; i++) {
      const idx = this._convGen(list[i], true)
      code += '[' + idx + ']'
    }
    return code
  }

  convLetArray(node) {
    const name = this._convGen(node.name, true)
    const list = node.index
    let code = name
    for (let i = 0; i < list.length; i++) {
      const idx = this._convGen(list[i], true)
      code += '[' + idx + ']'
    }
    const value = this._convGen(node.value, true)
    code += ' = ' + value + ';\n'
    return this.convLineno(node, false) + code
  }

  convGenLoop (node) {
    const tmpflag = this.flagLoop
    this.flagLoop = true
    try {
      return this._convGen(node, false)
    } finally {
      this.flagLoop = tmpflag
    }
  }

  convFor (node) {
    // ループ変数について
    let word
    if (node.word !== null) { // ループ変数を使う時
      const varName = node.word.value
      this.varsSet.names.add(varName)
      word = this.varname(varName)
    } else {
      this.varsSet.names.add('dummy')
      word = this.varname('dummy')
    }
    const idLoop = this.loop_id++
    const varI = `$nako_i${idLoop}`
    // ループ条件を確認
    const kara = this._convGen(node.from, true)
    const made = this._convGen(node.to, true)
    // ループ内のブロック内容を得る
    const block = this.convGenLoop(node.block)
    // ループ条件を変数に入れる用
    const varFrom = `$nako_from${idLoop}`
    const varTo = `$nako_to${idLoop}`
    let sorePrefex = ''
    if (this.speedMode.invalidSore === 0) {
      sorePrefex = `${this.varname('それ')} = `
    }
    const code =
      `\n//[FOR id=${idLoop}]\n` +
      `${varFrom} = ${kara};\n` +
      `${varTo} = ${made};\n` +
      `if (${varFrom} <= ${varTo}) { // up\n` +
      `  for (${varI} = ${varFrom}; ${varI} <= ${varTo}; ${varI}++) {\n` +
      `    ${sorePrefex}${word} = ${varI};\n` +
      `    ${block}\n` +
      `  };\n` +
      `} else { // down\n` +
      `  for (${varI} = ${varFrom}; ${varI} >= ${varTo}; ${varI}--) {\n` +
      `    ${sorePrefex}${word} = ${varI};` + '\n' +
      `    ${block}\n` +
      `  };\n` +
      `};\n//[/FOR id=${idLoop}]\n`
    return this.convLineno(node, false) + code
  }

  convForeach (node) {
    let target
    if (node.target === null) {
      target = this.varname('それ')
    } else{target = this._convGen(node.target, true)}

    // blockより早く変数を定義する必要がある
    let nameS = '$__v0["対象"]'
    if (node.name) {
      nameS = this.varname(node.name.value)
      this.varsSet.names.add(node.name.value)
    }
  
    const block = this.convGenLoop(node.block)
    const id = this.loop_id++
    const key = '$__v0["対象キー"]'
    let sorePrefex = ''
    if (this.speedMode.invalidSore === 0) {
      sorePrefex = `${this.varname('それ')} = `
    }
    const varArray = `$__foreach_array${id}`
    const varV = `$__foreach_v${id}`
    const varKey = `$__foreach_key${id}`
    const code =
      `${varArray}=${target};\n` +
      `if (!is_array(${varArray})){ ${varArray}=[${target}];}\n` +
      `foreach (${varArray} as ${varKey} => ${varV})` + '{\n' +
      `  ${nameS} = ${sorePrefex}${varV};` + '\n' +
      `  ${key} = ${varKey};\n` +
      `  ${block}\n` +
      '};\n'
    return this.convLineno(node, false) + code
  }

  convRepeatTimes (node) {
    const id = this.loop_id++
    const value = this._convGen(node.value, true)
    const block = this.convGenLoop(node.block)
    const kaisu = '$__v0["回数"]'
    let sorePrefex = ''
    if (this.speedMode.invalidSore === 0) {
      sorePrefex = `${this.varname('それ')} = `
    }
    const code =
      `$nako_times_v${id} = ${value};\n` +
      `for($nako_i${id} = 1; $nako_i${id} <= $nako_times_v${id}; $nako_i${id}++)` + '{\n' +
      `  ${sorePrefex}${kaisu} = $nako_i${id};` + '\n' +
      '  ' + block + '\n}\n'
    return this.convLineno(node, false) + code
  }

  /**
   * @param {Ast} node
   * @param {boolean} isExpression
   */
  convSpeedMode (node, isExpression) {
    const prev = { ...this.speedMode }
    if (node.options['行番号無し']) {
      this.speedMode.lineNumbers++
    }
    if (node.options['暗黙の型変換無し']) {
      this.speedMode.implicitTypeCasting++
    }
    if (node.options['強制ピュア']) {
      this.speedMode.forcePure++
    }
    if (node.options['それ無効']) {
      this.speedMode.invalidSore++
    }
    try {
      return this._convGen(node.block, isExpression)
    } finally {
      this.speedMode = prev
    }
  }

  /**
   * @param {Ast} node
   * @param {boolean} isExpression
   */
  convPerformanceMonitor (node, isExpression) {
    const prev = { ...this.performanceMonitor }
    if (node.options['ユーザ関数']) {
      this.performanceMonitor.userFunction++
    }
    if (node.options['システム関数本体']) {
      this.performanceMonitor.systemFunctionBody++
    }
    if (node.options['システム関数']) {
      this.performanceMonitor.systemFunction++
    }
    try {
      return this._convGen(node.block, isExpression)
    } finally {
      this.performanceMonitor = prev
    }
  }

  convWhile (node) {
    const cond = this._convGen(node.cond, true)
    const block = this.convGenLoop(node.block)
    const code =
      `while (${cond})` + '{\n' +
      `  ${block}` + '\n' +
      '}\n'
    return this.convLineno(node, false) + code
  }

  convSwitch (node) {
    const value = this._convGen(node.value, true)
    const cases = node.cases
    const trim = (s) => s.replace(/(^\s+|\s+$)/,'')
    let body = ''
    for (let i = 0; i < cases.length; i++) {
      const cvalue = cases[i][0]
      const cblock = this.convGenLoop(cases[i][1])
      if (cvalue.type == '違えば') {
        body += `  default:\n`
      } else {
        const cvalue_code = this._convGen(cvalue, true)
        body += `  case ${trim(cvalue_code)}:\n`
      }
      body += `    ${trim(cblock)}\n` +
              `    break;\n`
    }
    const code =
      `switch (${value})` + '{\n' +
      `${body}` + '\n' +
      '}\n'
    return this.convLineno(node, false) + code
  }

  convIf (node) {
    const expr = this._convGen(node.expr, true)
    const block = this._convGen(node.block, false)
    const falseBlock = (node.false_block === null)
      ? ''
      : 'else {' + this._convGen(node.false_block, false) + '};\n'
    return this.convLineno(node, false) +
      `if (${expr}) {\n  ${block}\n}` + falseBlock + ';\n'
  }

  convTikuji (node) {
    // gen tikuji blocks
    let code = `// PHPモードで逐次実行は普通の文に変換されました。\n`
    for (let i = 0; i < node.blocks.length; i++) {
      const block = this._convGen(node.blocks[i], false).replace(/\s+$/, '') + '\n'
      const blockLineNo = this.convLineno(node.blocks[i], true)
      code += blockLineNo + block + '\n'
    }
    code += `// ここまで「逐次実行」 \n`
    return this.convLineno(node, false) + code
  }

  convFuncGetArgsCalcType (funcName, func, node) {
    const args = []
    const opts = {}
    for (let i = 0; i < node.args.length; i++) {
      const arg = node.args[i]
      if (i === 0 && arg === null && this.speedMode.invalidSore === 0) {
        args.push(this.varname('それ'))
        opts['sore'] = true
      } else
        {args.push(this._convGen(arg, true))}

    }
    return [args, opts]
  }

  getPluginList () {
    const r = []
    for (const name in this.__self.__module) {r.push(name)}
    return r
  }

  /**
   * 関数の呼び出し
   * @param {Ast} node
   * @param {boolean} isExpression
   * @returns string コード
   */
  convFunc (node, isExpression) {
    const funcName = NakoGen.getFuncName(node.name)
    const res = this.findVar(funcName)
    if (res === null) {
      throw NakoSyntaxError.fromNode(`関数『${funcName}』が見当たりません。有効プラグイン=[` + this.getPluginList().join(', ') + ']', node)
    }
    let func
    if (res.i === 0) { // plugin function
      func = this.__self.funclist[funcName]
      if (func.type !== 'func') {
        throw NakoSyntaxError.fromNode(`『${funcName}』は関数ではありません。`, node)
      }
    } else {
      func = this.nako_func[funcName]
      // 無名関数の可能性
      if (func === undefined) {func = {return_none: false}}
    }
    // 関数の参照渡しか？
    if (node.type === 'func_pointer') {
      return res.js
    }
    // なでしこで定義した関数？
    const isUserFunc = (typeof(func.fn) === 'string')
    //console.log('@@@', funcName, typeof(func.fn))

    // 関数の参照渡しでない場合
    // 関数定義より助詞を一つずつ調べる
    const argsInfo = this.convFuncGetArgsCalcType(funcName, func, node)
    const args = argsInfo[0]
    args.push('$nako3')
    const argsOpts = argsInfo[1]
    // function
    this.used_func.add(funcName)
    let funcBegin = ''
    let funcEnd = ''
    // setter?
    if (node['setter']) {
      funcBegin += `;$nako3['isSetter'] = true;\n`
      funcEnd += `;$nako3['isSetter'] = false;\n`
    }
    // 変数「それ」が補完されていることをヒントとして出力
    if (argsOpts['sore']){funcBegin += '/*[sore]*/'}
    
    // インデント用
    const indent = (text, n) => {
      let result = ''
      for (const line of text.split('\n')) {
        if (line !== '') {
          result += '  '.repeat(n) + line + '\n'
        }
      }
      return result
    }

    // 関数呼び出しコードの構築
    let argsCode = args.join(',')
    let funcCall = `${res.js}(${argsCode})`

    let code = ``
    if (func.return_none) {
      if (funcEnd === '') {
        if (funcBegin === '') {
          code = `${funcCall};\n`
        } else {
          code = `${funcBegin} ${funcCall};\n`
        }
      } else {
        code = `${funcBegin}try {\n${funcCall};\n} finally {\n${funcEnd}}\n`
      }
    } else {
      let sorePrefex = `${this.varname('それ')} = `
      if (funcBegin === '' && funcEnd === '') {
        code = `${sorePrefex}${funcCall}`
      } else {
        if (funcEnd === '') {
          code = `(function($nako3){\nglobal $__v0,$__v1,$__v2,$__locals;\n${indent(`${funcBegin};\nreturn ${sorePrefex} ${funcCall};`, 1)}})($nako3)`
        } else {
          code = `(function($nako3){\nglobal $__v0,$__v1,$__v2,$__locals;${indent(`${funcBegin}try {\n${indent(`return ${sorePrefex}${funcCall};`, 1)}\n} finally {\n${indent(funcEnd, 1)}}`, 1)}})($nako3)`
        }
      }
      // ...して
      if (node.josi === 'して' || (node.josi === '' && !isExpression)){code += ';\n'}
    }
    return code
  }

  convRenbun(node) {
    let right = this._convGen(node.right, true)
    let left = this._convGen(node.left, false)
    return `(function($nako3){${left}; return ${right}})($nako3)`
  }

  convOp (node) {
    const OP_TBL = { // トークン名からJS演算子
      '&': '.',
      'eq': '==',
      'noteq': '!=',
      '===': '===',
      '!==': '!==',
      'gt': '>',
      'lt': '<',
      'gteq': '>=',
      'lteq': '<=',
      'and': '&&',
      'or': '||',
      'shift_l': '<<',
      'shift_r': '>>',
      'shift_r0': '>>>'
    }
    let op = node.operator // 演算子
    let right = this._convGen(node.right, true)
    let left = this._convGen(node.left, true)
    if (op === '+' && this.speedMode.implicitTypeCasting === 0) {
      if (node.left.type !== 'number') {
        left = `floatval(${left})`
      }
      if (node.right.type !== 'number') {
        right = `floatval(${right})`
      }
    }
    // 階乗
    if (op === '^')
      {return '(Math.pow(' + left + ',' + right + '))'}

    // 一般的なオペレータに変換
    if (OP_TBL[op]) {op = OP_TBL[op]}
    //
    return `(${left} ${op} ${right})`
  }

  convLet (node) {
    // もし値が省略されていたら、変数「それ」に代入する
    let value = null
    if (this.speedMode.invalidSore === 0) {value = this.varname('それ')}
    if (node.value) {value = this._convGen(node.value, true)}
    if (value == null) {
      throw NakoSyntaxError.fromNode(`代入する先の変数名がありません。`, node)
    }
    // 変数名
    const name = node.name.value
    const res = this.findVar(name)
    let code = ''
    if (res === null) {
      this.varsSet.names.add(name)
      code = `${this.varname(name)}=${value};`
    } else {
      // 定数ならエラーを出す
      if (this.varslistSet[res.i].readonly.has(name)) {
        throw NakoSyntaxError.fromNode(
          `定数『${name}』は既に定義済みなので、値を代入することはできません。`, node)
      }
      code = `${res.js}=${value};`
    }

    return ';' + this.convLineno(node, false) + code + '\n'
  }

  convDefLocalVar (node) {
    const value = (node.value === null) ? 'null' : this._convGen(node.value, true)
    const name = node.name.value
    const vtype = node.vartype // 変数 or 定数
    // 二重定義？
    if (this.varsSet.names.has(name))
      {throw NakoSyntaxError.fromNode(`${vtype}『${name}』の二重定義はできません。`, node)}

    //
    this.varsSet.names.add(name)
    if (vtype === '定数') {
      this.varsSet.readonly.add(name)
    }
    const code = `${this.varname(name)}=${value};\n`
    return this.convLineno(node, false) + code
  }
  
  // #563 複数変数への代入
  convDefLocalVarlist (node) {
    let code = ''
    const vtype = node.vartype // 変数 or 定数
    const value = (node.value === null) ? 'null' : this._convGen(node.value, true)
    this.loop_id++
    let varI = `$nako_i${this.loop_id}`
    code += `${varI}=${value}\n`
    code += `if (!is_array(${varI})) { ${varI}=[${varI}] }\n`
    for (let nameObj of node.names) {
      const name = nameObj.value
      // 二重定義？
      if (this.varsSet.names.has(name))
        {throw NakoSyntaxError.fromNode(`${vtype}『${name}』の二重定義はできません。`, node)}
      //
      this.varsSet.names.add(name)
      if (vtype === '定数') {
        this.varsSet.readonly.add(name)
      }
      let vname = this.varname(name)
      code += `${vname}=array_shift(${varI});\n`
    }
    return this.convLineno(node, false) + code
  }

  convString (node) {
    let value = '' + node.value
    let mode = node.mode
    value = value.replace(/\\/g, '\\\\')
    value = value.replace(/"/g, '\\"')
    value = value.replace(/\r/g, '\\r')
    value = value.replace(/\n/g, '\\n')
    if (mode === 'ex') {
      throw new Error('文字列の展開は未サポートです。')
    }
    return '"' + value + '"'
  }

  convTryExcept(node) {
    const block = this._convGen(node.block, false)
    const errBlock = this._convGen(node.errBlock, false)
    return this.convLineno(node, false) +
      `try {\n${block}\n} catch ($e) {\n` +
      '  $__v0["エラーメッセージ"] = $e.getMessage();\n' +
      ';\n' +
      `${errBlock}}\n`
  }
}
