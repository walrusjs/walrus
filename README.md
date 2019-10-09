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

## 项目由来以及定位

**项目由来:**

新开发一个前端项目，为了代码质量管控和团队一致性，总会需要配置lint、jest、...，每个配置项目都会有一份配置,会引发难以保证每个项目做到完全统一，同时需要安装各种依赖，比较繁琐，

社区上的解决方案有以下：

 1. 使用抽取配置为单独的npm包 缺点: 无法解决安装众多依赖的问题
 2. 通过项目模板创建项目 缺点: 模板升级不好对历史项目进行修改，无法解决安装众多依赖的问题
 
综上考虑，开发一个拥有插件体系的cli工具，对常用的工具进行封装、根据约定大于配置的原则，内置最优配置

最后结果: 只需要安装 `@walrus/cli` 一个依赖，所有配置内置，当然支持自定义配置

**项目定位:** 

不造轮子，只封装已有的成熟工具，会根据工作经验，开发一些实用的插件

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
|@walrus/walrus-plugin-eslint|[![NPM version](https://img.shields.io/npm/v/@walrus/walrus-plugin-eslint.svg?style=flat)](https://npmjs.org/package/@walrus/walrus-plugin-eslint)|封装eslint|
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


## 🌟 社区

* 钉钉，请扫描下面的二维码加群

<img height="200" src="https://github.com/alitajs/alita/blob/master/public/dingding.png"></img> 

* 微信，扫描二维码添加机器人，回复alita进群

<img height="200" src="https://github.com/alitajs/alita/blob/master/public/wechat.png"></img> 
