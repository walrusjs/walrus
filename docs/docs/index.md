---
title: 介绍
nav:
  title: 文档
  order: 1
---

# Walrus 是什么

Walrus 是一个可扩展的开发命令行工具框架，基础包提供一个命令注册中心，通过插件机制封装一些命名行工具，帮助开发者快速的开发出命令行工具

## 项目由来

新开始一个项目，为了代码质量管控和团队风格一致性，需要配合各种lint工具，这样的话每个项目都会拥有一份配置，一旦团队项目数目过多，去保证每个项目的配置一致，依赖一致，将会比较麻烦。

总结如下：

1. 配置文件过多
2. 依赖过多
3. 团队项目很难做到完全统一

解决方案：

开发一个命令行工具，内置所有配置，只需一两个依赖就可以提供所有功能。


## 特性

- 🚀 快速，默认零配置
- 💅 内置封装jest、prettier、eslint、stylelint、commitlint
- 🎶 插件体系，支持扩展
- 💻 使用 TypeScript 编写