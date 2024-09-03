module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    "prettier/vue"
  ],
  plugins: [
    'unicorn',
    'vue'
  ],
  // add your custom rules here
  rules: {
    /****************/
    /* 一般代码规则 */
    /****************/

    // 在模块导入顺序中执行约定
    'import/order': 'error',

    // Imports 优先
    'import/first': 'error',

    // 禁止使用带有var或let的可变导出。
    'import/no-mutable-exports': 'error',

    // 允许未解析的导入
    'import/no-unresolved': 'off',

    // 仅当没有大括号时才允许无括号箭头函数
    // { requireForBlockBody: true } * 修改
    'arrow-parens': ['error', 'as-needed'],

    // 允许 async-await
    'generator-star-spacing': 'off',

    // 开发期间允许调试器
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    'vue/html-self-closing': 'off',

    // 尽量用 const 代替 let
    'prefer-const': ['error', {
      destructuring: 'any',
      ignoreReadBeforeAssign: false
    }],

    // 禁止 if 作为唯一的语句出现在 else 语句中
    'no-lonely-if': 'error',

    // 强制所有控制语句使用一致的括号风格
    curly: ['error', 'all'],

    // 禁止使用不带 await 表达式的 async 函数
    'require-await': 'error',

    // 强制尽可能地使用点号
    'dot-notation': 'error',

    // 要求使用 let 或 const 而不是 var
    'no-var': 'error',

    // 在可能的情况下尽量使用对象简写语法
    'object-shorthand': 'error',

    // 禁止在 import 和 export 和解构赋值时将引用重命名为相同的名字
    'no-useless-rename': 'error',

    /**********************/
    /*   Unicorn 规则     */
    /**********************/

    // 抛出错误时传递错误消息
    'unicorn/error-message': 'error',

    // 大写正则表达式转义
    'unicorn/escape-case': 'error',

    // Array.isArray 代替 instanceof
    'unicorn/no-array-instanceof': 'error',

    // 阻止使用不推荐的 `new Buffer()`
    'unicorn/no-new-buffer': 'error',

    // 保证 regex 文本安全!
    'unicorn/no-unsafe-regex': 'off',

    // 2,8,16进制数字小写 (0x12 替换 0X12)
    'unicorn/number-literal-case': 'error',

    // ** 替换 Math.pow()
    'unicorn/prefer-exponentiation-operator': 'error',

    // 当检查是否存在时 includes 优于 indexOf
    'unicorn/prefer-includes': 'error',

    // 字符串方法 startsWith/endsWith 替代其他复杂的写法
    'unicorn/prefer-starts-ends-with': 'error',

    // textContent 替换 innerText
    'unicorn/prefer-text-content': 'error',

    // 在检查 typeof 时抛出错误时强制抛出类型错误
    'unicorn/prefer-type-error': 'error',

    // 抛出错误时使用 new
    'unicorn/throw-new-error': 'error',

    /**********************/
    /*     Vue 规则      */
    /**********************/

    // 禁用有关无效结束标记的模板错误
    'vue/no-parsing-error': ['error', {
      'x-invalid-end-tag': false
    }],

    // 每行最多5个属性
    'vue/max-attributes-per-line': ['error', {
      singleline: 5
    }]
  }
}
