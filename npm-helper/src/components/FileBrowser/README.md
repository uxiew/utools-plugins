# FileBrowser 组件

Props：
| prop              | 描述                           | 默认值                    |
| ----------------- | ------------------------------ | ------------------------- |
| directory-listing | 必须传入的数据结构             | [Array] []                |
| pkg-name          | root dir 文件名 或者是 pkgName | [string] ''               |
| search            | 是否显示顶部搜索               | [boolean] false           |
| @get-path         | 点击事件                       | [string] 当前点击项的路径 |


# 数据结构

支持传入数据结构为：

```js
['assets', [['growl', ['error.png', 'ok.png']]]]; 

// 表示 /assets/growl/error.png，/assets/growl/ok.png
```

1. 一个数组表示一个文件夹，第一项为字符串，为该文件夹的名称；
2. 该结构中，文件夹总是比文件优先排列在前。

示例：
mocha v7.2.0 npm 库结构：

```js
private files = [
    {
      "type": "directory",
      "name": "dist",
      "files": [
        {
          "type": "file",
          "name": "aimer.common.js",
          "hash": "BM53wc1Ynp4xGlK2wM0jAfx+ajMiORz9GblbiC5yUo4=",
          "time": "2017-11-01T03:23:44.000Z",
          "size": 37852
        },
        {
          "type": "file",
          "name": "aimer.css",
          "hash": "cWHBlambgzD37G1Ann0o3t8uYWX8afhQ8h+jmMnJMfU=",
          "time": "2017-11-01T03:23:48.000Z",
          "size": 21486
        },
        {
          "type": "file",
          "name": "aimer.js",
          "hash": "BZmv80w//xQ4nrwJk5PQQDjXvXR04VsoL1azmC82W+c=",
          "time": "2017-11-01T03:23:48.000Z",
          "size": 291469
        }
      ]
    },
    {
      "type": "file",
      "name": "package.json",
      "hash": "BnfoDn6ahGmRgnB3IKKhviCEYArVcnnCsS5NlyH7YuY=",
      "time": "2017-11-01T03:23:39.000Z",
      "size": 840
    }
]
    //  或者下面👇这种格式
private files = [
    ['assets', [['growl', ['error.png', 'ok.png']]]],
    ['bin', ['_mocha', 'mocha']],
    [
      'lib',
      [
        ['browser', ['growl.js', 'progress.js', 'template.html', 'tty.js']],
        [
          'cli',
          [
            'cli.js',
            'collect-files.js',
            'commands.js',
            'config.js',
            'index.js',
            'init.js',
            'node-flags.js',
            'one-and-dones.js',
            'options.js',
            'run-helpers.js',
            'run-option-metadata.js',
            'run.js',
            'watch-run.js'
          ]
        ],
        [
          'interfaces',
          [
            'bdd.js',
            'common.js',
            'exports.js',
            'index.js',
            'qunit.js',
            'tdd.js'
          ]
        ],
        [
          'reporters',
          [
            'base.js',
            'doc.js',
            'dot.js',
            'html.js',
            'index.js',
            'json-stream.js',
            'json.js',
            'landing.js',
            'list.js',
            'markdown.js',
            'min.js',
            'nyan.js',
            'progress.js',
            'spec.js',
            'tap.js',
            'xunit.js'
          ]
        ],
        'context.js',
        'errors.js',
        'esm-utils.js',
        'growl.js',
        'hook.js',
        'mocha.js',
        'mocharc.json',
        'pending.js',
        'runnable.js',
        'runner.js',
        'stats-collector.js',
        'suite.js',
        'test.js',
        'utils.js'
      ]
    ],
    'browser-entry.js',
    'CHANGELOG.md',
    'index.js',
    'LICENSE',
    'mocha.css',
    'mocha.js',
    'package.json',
    'README.md'
  ];
```


# TOOD
1. # 原版 搜索功能 👍 ,例如：搜索 m d e a r ，依然可以搜索到，目前还没有做该功能😭，待闲暇时~


# Fix
* 可能需要修复一个页面多组件所带来的搜索文件重复问题~🙃
* 增加对其他传入数据格式的支持，目前只能按照，以上数据格式形式传入~

# 参考

想法来源于：
[runkit](https://npm.runkit.com/typescript/)
[data.jsdelivr](https://data.jsdelivr.com/v1/package/npm/typescript)