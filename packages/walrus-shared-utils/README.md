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
- [isUrl](#isUrl)
- [clearConsole](#clearConsole)
- [Logger](#Logger)
- [compatDirname](#compatDirname)
- [configLoader](#configLoader)
- [checkNodeVersion](#checkNodeVersion)
- [chalk](#chalk)
- [semver](#semver)

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

### isUrl

- 使用:

```
import { isUrl } form '@walrus/shared-utils';
```

- 类型:

```
(path: string) => boolean;
```

- 描述: path是否是Url

### clearConsole

- 使用:

```
import { clearConsole } form '@walrus/shared-utils';
```

- 类型:

```
() => void;
```

- 描述: 清空控制台

### Logger

- 使用:

```
import { Logger } form '@walrus/shared-utils';

const logger = new Logger();

logger.log('log output');
logger.info('info output');
logger.done('done output');
logger.warn('warn output');
logger.error('error output');
```

- 类型:

```
class
```

- 描述: 日志输出


### compatDirname

- 使用:

```
import { compatDirname } form '@walrus/shared-utils';
```

- 类型:

```
(path: string, cwd: string, fallback) => void;
```

- 描述: 查找模块路径

### configLoader

> 封装`joycon`支持读取`.ts`后缀配置文件，具体API请查看[joycon](https://github.com/egoist/joycon)

- 使用:

```
import { compatDirname } form '@walrus/shared-utils';

const userConfig = configLoader.loadSync([
  'walrus.config.js',
  'walrus.config.ts'
], process.cwd());
```

- 类型:

- 描述: 读取配置文件

### checkNodeVersion

- 使用:

```
import { checkNodeVersion } form '@walrus/shared-utils';

// 获取node兼容版本
const requiredVersion = require('../package.json').engines.node;

checkNodeVersion(checkNodeVersion, '@walrus/cli')
```

- 类型:

```
(wanted: string, id: string) => void
```

- 描述: 检查Node版本 

### chalk

> 导出`chalk`, 具体文档请查看[chalk](https://github.com/chalk/chalk)

- 使用:

```
import { chalk } form '@walrus/shared-utils';
```

### semver

> 导出`semver`, 具体文档请查看[semver](https://github.com/semver/semver)

- 使用:

```
import { semver } form '@walrus/shared-utils';
```


