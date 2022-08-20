# utools plugins
该项目只做个人学习 utools 使用！请勿用于非法用途！任何非法用户本人在此申明：本人不承担任何责任！

## 目录结构
```
---....
---utools-debug	# utools 的 app.asar 源代码学习分析
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
 n.isDev = !!t || s().dev() && !/\.asar$/.test(n.location)


 'export ELECTRON_IS_DEV=1' in process.env (process.env.ELECTRON_IS_DEV=1); 'electron-is-dev'
```


# 修改 utools 源码
安装 asar 模块：
```
npm install -g asar
```


## 步骤
注意需要拷贝 utools 下 app.asar 文件、app.asar.unpacked 目录，然后放置在同一目录下。

1. 解压一个包：
```
asar extract app.asar ./utools/app
```

借助 chrome DevTools ，修改里面的内容：
1. 取消非官方商店插件的验证及运行限制
  `dist/main.js` 文件中 修改为：
   ```
   /*if (s.illegal)
                                        return new t.Notification({
                                            title: "uTools 安全检测",
                                            body: "当前安装的插件应用「" + s.pluginName + "」未通过安全验证，无法运行"
                                        }).show(),
                                        this.destroyPlugin(e),
                                        void this.emptyRecovery();*/ // chandlerver5
  ```

  ```
    // chandlerver5 
                      /* if (e.illegal_plugins?.length > 0)
                          for (const t of e.illegal_plugins) {
                              const e = this.pluginContainer[t];
                              e && (e.illegal = !0,this.setPluginDirNameIllegal(t))
                          }
                          */
  ```
                         
2. 开放所有插件的 DevTool 调试功能
  `dist/main.js` mount 函数中：添加的 `n.isDev = true` 是重点
  ```
  n.name in this.pluginContainer && R().lt(n.version, this.pluginContainer[n.name].version))
                    throw new Error("已存在版本 " + this.pluginContainer[n.name].version);
                return n.isDev = true,this.pluginContainer[n.name] = n,
                this.emit("mount", n.name),
  ```

  `dist/plugins/v5/index.js`中 插件列表显示修改：
  去除 `isDev` 判断
  ```
  componentDidMount() {
                const e = window.services.getPluginUpdateSet()
                  , t = window.services.getPluginContainer()
                  , n = Object.values(t).filter((e=>e.name && "FFFFFFFF" !== e.name)).sort(((e,t)=>t.updateTime - e.updateTime));
                let r;
  ```

  `dist/plugins/v5/index.js`去除 ‘未通过安全验证，无法运行’ 提示
  ```
  primary: e.createElement("div", {
                        className: "installed-plugin-name"
                    }, n.pluginName, e.createElement("span", null, "v", n.version), n.unsafe && e.createElement(ha, {
                        title: "非安全方式安装"
                    }, e.createElement(dh.Z, {
                        color: "warning"
                    }))),
                    secondary: n.description
  ```

  `dist/index.js`去除 `i.isDev` 判断及其显示
  ```
   }, this.cmdLabel(t.cmd, t.indexAt, a)), e.createElement("div", {
  ```



3. 再压缩回去
```
asar pack ./app ./utools/app.asar
```
用新的包替换原来的!



# uTools 开发者工具
反编译：
```
asar p utools-dev-tool 85cdaab634dd9e3af404d827c53d2853.asar && mv -f 85cdaab634dd9e3af404d827c53d2853.asar /Users/bing/Library/Application\ Support/uTools/plugin
```

85cdaab634dd9e3af404d827c53d2853.asar 是 uTools 开发者工具 安装后的文件，需要自己寻找（可借助 asar 插件查看）

## 注意⚠️
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
