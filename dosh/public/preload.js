// preload.js 中使用 nodejs
const { readFileSync } = require('fs');
const https = require('https');
const fs = require('fs');

/**
 * 下载指定文件 到 指定目录
 */
const downloadFileAsync = (uri, path) => {
  let dest = path || `${utools.getPath('userData')}/plugins/mdn-index.json`;
  return new Promise((resolve, reject) => {
    // 确保dest路径存在
    const file = fs.createWriteStream(dest);

    https.get(uri, res => {
      if (res.statusCode !== 200) {
        reject(response.statusCode);
        return;
      }

      res.on('end', () => {
        console.log('download end');
      });

      // 进度、超时等

      file
        .on('finish', () => {
          console.log('finish write file');
          file.close(resolve);
        })
        .on('error', err => {
          fs.unlink(dest);
          reject(err.message);
        });

      res.pipe(file);
    });
  });
};

window.asarFileName = __dirname.match(/[^/]+$/)[0];
window.pluginPath = __dirname.replace(window.asarFileName, '');

window.downloadFileAsync = downloadFileAsync;
