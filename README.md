# speike-cli
[![npm](https://img.shields.io/npm/v/speike.svg)](https://www.npmjs.com/package/speike)
[![Build Status](https://travis-ci.org/haotech/speike-cli.svg?branch=master)](https://travis-ci.org/haotech/speike-cli)
[![Coverage Status](https://coveralls.io/repos/github/haotech/speike-cli/badge.svg?branch=master)](https://coveralls.io/github/haotech/speike-cli?branch=master)

简单且通用的脚手架工具

### 安装

条件：[Node.js](https://nodejs.org/en/) >= 6.x 

```base
$ npm install -g speike
```

### 使用

```base
$ speike init <template-name> <project-name>
```

例子：

```base
$ speike init speike-template-haotech hao-project
```

上面的例子首先会从 [haotech/speike-template-haotech](https://github.com/haotech/speike-template-haotech) 拉取模板，然后根据模板项目中根目录下 [metadata.js](https://github.com/haotech/speike-template-haotech/blob/master/metadata.js) 文件中 `prompts` 的配置使用 [交互命令](https://github.com/SBoudrias/Inquirer.js) 获取一些信息，最后通过这些获取到的信息生成 `hao-project` 项目。

### 推荐模板

speike 提供了一些常用的，并且比较推荐的模板，这些模板目前在 [haotech](https://github.com/haotech) 组织下，全部以 `haotech-template` 开头命名，所有推荐模板均可以用 `speike init <template-name> <project-name>` 这行命令使用并生成项目，你也可以使用 `speike list` 命令来查看当前有哪些可用的模板。

推荐模板：

- [speike-template-haotech](https://github.com/haotech/speike-template-haotech) 功能齐全的前后端分离项目，该项目使用 Thinkjs 3.x + Vue + Vuex 架构。

### 自定义模板

推荐的模板并不能覆盖所有需求场景，所以用户可以编写自己的自定义模板，只需要遵循一定的[规则](#编写自定义模板)即可。

当编写好自定义的模板之后，可以通过下面的命令来使用该模板。

```base
$ speike init username/repo my-project
```

模板下载功能是基于 [download-git-repo](https://github.com/flipxfx/download-git-repo) 开发，所以可以使用 `download-git-repo` 的全部语法。

例如拉取模板的指定分支：

```base
$ speike init owner/name#my-branch
```

如果您想从私有仓库下载模板，请使用 `-c` 或 `--clone`，speike将使用 `git clone` 来下来您的模板。

仓库支持：

- Github - `github:owner/name` or simply `owner/name`
- GitLab - `gitlab:owner/name`
- Bitbucket - `bitbucket:owner/name`

### 编写自定义模板

- 模板仓库根目录必须有一个 `template` 文件夹
- 模板仓库根目录下必须有一个 `metadata` 文件，`metadata.js` 或者 `metadata.json` 二选一，`metadata` 文件必须包含以下字段：
  - `prompts`：用于配置命令行如何与人进行交互，从而收集一些模板需要的信息

#### prompts

metadata 文件中的 `prompts` 字段必须是一个 `Object` 包含了用户提示信息，`prompts` 中的每个key会对应生成一个变量，可以在 `template` 文件夹内的模板中使用，就像 ejs, jade, nunjucks 中传入模板中的变量一样（事实上就是使用模板引擎来实现的），而每个key对应的 `value` 是一个 [Inquirer.js question object](https://github.com/SBoudrias/Inquirer.js/#question)，例如：

```json
{
  "prompts": {
    "name": {
      "type": "string",
      "required": true,
      "message": "Project name"
    }
  }
}
```

当所有与用户间的询问完成之后，会进行模板渲染，这里使用的模板引擎是 [Handlebars](http://handlebarsjs.com/)，与用户交互完毕后拿到的数据会传入到模板引擎中~

所以在模板引擎中可以使用 [Handlebars](http://handlebarsjs.com/) 的所有语法，例如 `{{expression}}`, `if` 等。

#### question object

question object 是一个`hash`，包含了一些与问题相关的值

- **type**: (String) 提示类型。默认为 `input`，可用类型：`input`， `confirm`， `rawlist`， `expand`， `checkbox`， `password`， `editor`
- **message**: (String) 在命令行中显示的问题
- **default**: (String|Number|Array) 问题的默认值
- **choices**: (Array) 值可以是`string`，也可以是`Object`，`Object` 包含`name`，`value`，`short`，`name` 是显示在终端列表中的名字，`value`是保存在`hash`中的值， `short`是选择后显示的值。

更多信息请查看 [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) 中的详细说明~
