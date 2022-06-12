# utools plugins
该项目只做个人学习 utools 使用！请勿用于非法用途！任何非法用户本人在此申明：本人不承担任何责任！

## 目录结构
```
---....
---sourcecode	# utools 的 asar 源代码分析
---upxs		# 插件合集
---utools-template-react  # react 开发插件的模版
---README.md	# 说明文档
```

# development
plugin.json 中加入开发模式热重载：
```
  "development": {
    "main": "http://localhost:8080"
  },
```

## 强制开启所有“开发者工具”
```
 n.isDev = !!t || s().dev() && !/\.asar$/.test(n.location),
```
1. 'export ELECTRON_IS_DEV=1' in process.env (process.env.ELECTRON_IS_DEV=1); 'electron-is-dev'
2. xxxxxx..asar  为文件名



# upx 插件
反编译：
```
asar p utools-dev-tool 85cdaab634dd9e3af404d827c53d2853.asar && mv -f 85cdaab634dd9e3af404d827c53d2853.asar /Users/bing/Library/Application\ Support/uTools/plugin
```

# 注意⚠️
1. `upx-开发者工具-1.1.0.upx`的安装：需要先安装原版，然后再进行替换 asar 文件。

# TODO
1. cdn;有些基于纯 Esbuild 来做线上 cjs -> esm 的 CDN 服务，比如 esm.sh  和 skypack:
2. 快速查询js、rust语法
3. xxxxx
3. 学习英语的插件
2. 查询成语，汉字，诗集
4. 直接查询 gitee,github,gitlab 资源,做 sourceviewer


# 官网 Github
https://github.com/uTools-Labs
