module.exports = {
  env: {
    // 更多配置详见：https://eslint.bootcss.com/docs/user-guide/configuring
    browser: true,
    es6: true,
  },
  extends: [
    "plugin:vue/recommended", // 适用于 Vue.js 2.x，使用 recommended 规则。详见：https://eslint.vuejs.org/user-guide/#usage
    "plugin:prettier/recommended", // eslint-config-prettier 和 eslint-plugin-prettier 两个插件的快捷配置（官方文档有详细说明）
  ],
  rules: {
    quotes: ["error", "single"], // 使用单引号
  },
  parserOptions: {
    parser: "babel-eslint", // 用于解析检查项目中用到的非标准或实验性的语法，比如异步 import
  },
};