// @ts-check
// @ts-ignore
module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    extends: [
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended',
    ],
    rules: {
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',

        /* 可自动修复的规则 */

        // 注释 - 注释后加空格
        'spaced-comment': ['error', 'always'],
        // 给if、for、do、while等语句的执行体加花括号 {}
        curly: ['error', 'all'],
        // 推荐在对象字面量中使用属性简写
        'object-shorthand': 'warn',
        // 每句代码后加分号
        'semi-style': ['warn', 'last'],
        // 在构造函数中禁止在调用super()之前使用this或super
        'no-this-before-super': 'error',
        // 不要使用字符串的行连续符号
        'no-multi-str': 'warn',
        // getter和setter应该成对出现在对象中
        'accessor-pairs': 'error',
        // 禁止在对象实例上直接使用 Object.prototypes 的内置属性
        'no-prototype-builtins': 'error',
        // 在switch语句的每一个有内容的case中都放置一条break语句
        'no-fallthrough': 'error',
        // case语句中需要声明词法时, 花括号{}不能省略
        'no-case-declarations': 'error',
        // 禁止在 finally 语句块中出现控制流语句句块中出现控制流语句
        'no-unsafe-finally': 'error',
        // 禁止在全局范围内声明
        'no-implicit-globals': ['error', { lexicalBindings: true }],
        // 使用模板字符串（` ` ）实现字符串拼接
        'prefer-template': 'error',
        // // 使用拖尾逗号
        // 'comma-dangle': ['warn', 'never'],
        // 禁止使用较短的符号实现类型转换
        'no-implicit-coercion': ['error', { allow: ['!!'] }],
        // 变量不需要用undefined初始化
        'no-undef-init': 'error',
        // 禁止多余的 return 语句
        'no-useless-return': 'error',
        // 链式调用对象方法时，一行最多调用4次，否则需要换行
        'newline-per-chained-call': ['warn', { ignoreChainWithDepth: 4 }],
        // 建议使用const
        'prefer-const': 'warn',
    },
}
