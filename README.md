<p align="center">
  <a href="https://github.com/walrus-plus/walrus">
    <img width="100" src="https://avatars0.githubusercontent.com/u/55735928?s=200&v=4">
  </a>
</p>

<h1 align="center">walrus</h1>

<div align="center">
Frontend development tools 
</div>

[![Alita](https://img.shields.io/badge/alitajs-walrus-blue.svg)](https://github.com/walrus-plus/walrus)

## ✨ 特性

* 🚀 零配置，配置已内置
* 💅 内置支持 jest、eslint、stylelint 等
* 🎉 插件体系，所有功能通过插件实现
* 💻 使用TypeScript编写

## 🌈 包

|包名|版本|描述|
|---|---|---|
|@walrus/cli|[![NPM version](https://img.shields.io/npm/v/@walrus/cli.svg?style=flat)](https://npmjs.org/package/@walrus/cli)|命令注册中心|
|@walrus/walrus-plugin-jest|[![NPM version](https://img.shields.io/npm/v/@walrus/walrus-plugin-jest.svg?style=flat)](https://npmjs.org/package/@walrus/walrus-plugin-jest)|封装Jest|
|@walrus/shared-utils|[![NPM version](https://img.shields.io/npm/v/@walrus/shared-utils.svg?style=flat)](https://npmjs.org/package/@walrus/shared-utils)|工具方法|
|@walrus/types|[![NPM version](https://img.shields.io/npm/v/@walrus/types.svg?style=flat)](https://npmjs.org/package/@walrus/types)|相关类型定义|


## 📦 安装

```
// npm
npm install @walrus/cli --dev

// yarn
yarn add @walrus/cli --dev

// 全局安装
yarn global add @walrus/cli

```

## 🔨 使用

### 测试

> 本项目自带@walrus/walrus-plugin-jest插件

* package.json 添加如下代码

```
// package.json

"scripts": {
  "test": "walrus test"
}
```

* 当前项目目录执行

```
yarn test
```

**注意:**

支持自定义配置 会自动读取`jest.config.js`和默认配置合并

## ⌨️ 本地开发

```
# 克隆项目到本地
git clone git@github.com:walrus-plus/walrus.git

# 安装依赖
yarn bootstarp
```
