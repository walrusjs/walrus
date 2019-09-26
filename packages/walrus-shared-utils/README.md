<h1 align="center">@walrus/shared-utils</h1>

[![Alita](https://img.shields.io/badge/alitajs-walrus-blue.svg)](https://github.com/walrus-plus/walrus)
[![NPM version](https://img.shields.io/npm/v/@walrus/shared-utils.svg?style=flat)](https://npmjs.org/package/@walrus/shared-utils)
[![NPM downloads](http://img.shields.io/npm/dm/@walrus/shared-utils.svg?style=flat)](https://npmjs.org/package/@walrus/shared-utils)

> 项目集成了多种工具方法，可作为cli的依赖包

## 📦 Install

```
// npm
npm install @walrus/shared-utils

// yarn
yarn add @walrus/shared-utils
```

## 🔨 Usage

```
import { lodash } form '@walrus/shared-utils';

const result = true;

if (lodash.isBoolean(result)) {
  console.log('result is boolean type');
}
```

## 🎉 目录

- [lodash](#lodash)
- [isLinux](#isLinux)
- [isWindows](#isWindows)
- [isMacintosh](#isMacintosh)

## ✨ API

### lodash 

```
import { lodash } form '@walrus/shared-utils';
```

文档请查看[lodash](https://lodash.com/)

### isLinux

- 使用:

```
import { isLinux } form '@walrus/shared-utils';
```

- 类型:

```
() => boolean;
```

- 描述: 是否是Linux系统

### isMacintosh

- 使用:

```
import { isLinux } form '@walrus/shared-utils';
```

- 类型:

```
() => boolean;
```

- 描述: 是否是Mac系统

### isWindows

- 使用:

```
import { isWindows } form '@walrus/shared-utils';
```

- 类型:

```
() => boolean;
```

- 描述: 是否是Windows系统



