
import { createReadStream, createWriteStream } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { createGzip } from 'node:zlib';
import { resolve as resolvePath } from 'node:path';
import { createPackage } from '@electron/asar';

// @ts-ignore
const TEMPORARY_DEST = resolvePath(`./utools_${Math.random()}.asar`);

const build = (inputDir: string, outFileName: string, reject: (err: any) => any) => {
  createPackage(inputDir, TEMPORARY_DEST).then((e) => {
    new Promise((resolve) =>
      createReadStream(TEMPORARY_DEST)
        .pipe(createGzip())
        .pipe(createWriteStream(outFileName))
        .on('error', reject)
        .on('finish', resolve)
    )
      .finally(() => unlink(TEMPORARY_DEST));
  });
};


build("/Users/bing/Projects/utools-plugins/utools-dev-tool/developer_tools_mod", `/Users/bing/Projects/utools-plugins/upxs/upx_dev_tools_v${require('../developer_tools_mod/plugin.json').version}.upx`, (error) => {
  console.log(error)
})
