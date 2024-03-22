> 配置文件在：`/Users/XXX/Library/Application\ Support/uTools/plugin`

1. 通过 `chrome://inspect` 启动调试
   需要运行：

   ```sh
   sudo /Applications/uTools.app/Contents/MacOS/uTools --remote-debugging-port=9222
   ```

2. 通过 VSCode 启动调试
   VSCode `launch.json` 配置参考：
   ```json
   {
     // Use IntelliSense to learn about possible attributes.
     // Hover to view descriptions of existing attributes.
     // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
     "version": "0.2.0",
     "configurations": [
       {
         "name": "uTools: Plugin",
         "type": "chrome", // use the Chrome debugger that comes with VS Code
         "request": "attach",
         "port": 9222, // use debug port opened in Electron: Main configuration
         "webRoot": "${workspaceFolder}",
         "timeout": 30000
       },
       {
         "name": "uTools: Main",
         "type": "node",
         "request": "launch",
         "runtimeExecutable": "/Applications/uTools.app/Contents/MacOS/uTools",
         "runtimeArgs": ["--remote-debugging-port=9222"]
       }
     ],
     "compounds": [
       {
         "name": "uTools: All",
         "configurations": ["uTools: Main", "uTools: Plugin"]
       }
     ]
   }
   ```

# 参考

[Debugging the Main Process](https://www.electronjs.org/docs/latest/tutorial/debugging-main-process)
