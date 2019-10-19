<p align="center">
  <a href="https://github.com/walrus-plus/walrus">
    <img width="100" src="https://avatars0.githubusercontent.com/u/55735928?s=200&v=4">
  </a>
</p>

<h1 align="center">walrus-plugin-commitlint</h1>

[![Alita](https://img.shields.io/badge/alitajs-walrus-blue.svg)](https://github.com/walrus-plus/walrus)
[![NPM version](https://img.shields.io/npm/v/@walrus/walrus-plugin-commitlint.svg?style=flat)](https://npmjs.org/package/@walrus/walrus-plugin-commitlint)

## 🔨 使用

`package.json`添加如下代码

```
"scripts": {
  "commitlint": "walrus commitlint --env HUSKY_GIT_PARAMS"
},
"husky": {
  "hooks": {
    "commit-msg": "yarn commitlint"
  }
}
```
