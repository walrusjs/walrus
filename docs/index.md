---
title: Walrus
hero:
  title: Walrus
  desc: 专注于提升开发效率、项目规范。
  actions:
    - text: 快速上手 →
      link: /zh-CN/docs/getting-started
features:
  - icon: https://gw.alipayobjects.com/zos/basement_prod/a1c647aa-a410-4024-8414-c9837709cb43/k7787itw_w126_h114.png
    title: 可扩展
    desc: walrus是一个插件注册中心，所有的功能都是通过插件实现。
  - icon: https://gw.alipayobjects.com/zos/basement_prod/b54b48c7-087a-4984-b150-bcecb40920de/k7787z07_w114_h120.png
    title: 开箱即用
    desc: 你只需walrus一个依赖就可以使用，无需安装jest、eslint、stylelint、commitlint以及其的插件。
  - icon: https://gw.alipayobjects.com/zos/basement_prod/201bea40-cf9d-4be2-a1d8-55bec136faf2/k7788a8s_w102_h120.png
    title: 约定大于配置
    desc: 规范无需太多讨论，遵守就可以了，我们的目标是尽量做到零配置。
footer: Walrus Team | Copyright © 2019-present
---

## 使用非常简单

```
# 全局安装
$ yarn global add @walrus/cli
# 或者 npm install -g @walrus/cli

# 测试
walrus test

# 检查js/ts代码
walrus lint

# 检查css代码
walrus stylelint

# 美化代码
walrus prettier

# 检查 commit message 配合husky使用
walrus commitlint --env HUSKY_GIT_PARAMS
```
