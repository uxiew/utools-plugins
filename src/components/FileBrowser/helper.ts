/**
 * @description 无扩展名时单纯为 file。注意根据 type 区分 不带扩展名的 为文件还是文件夹
 * @param {string} name  - 文件名
//  * @param {string} [type='file'] - 文件还是文件夹
 */
export const getFileIcon = (name: string) => {
  const textFiles = /\.txt|\.md|\.markdown|\.log/;
  const codeFiles = /\.js|\.mjs|\.coffee|\.html|\.css|\.scss|\.sass|\.pug|\.ts|\.json/;
  const imageFiles = /\.png|\.jpg|\.gif|\.jpeg|\.bpm/;

  if (textFiles.test(name)) {
    return 'file-text-o';
  }
  if (codeFiles.test(name)) {
    return 'file-code-o';
  }
  if (imageFiles.test(name)) {
    return 'file-image-o';
  }
  //   if (name.indexOf('.') < 0 || name === 'LICENSE') {
  else {
    return 'file-o';
  }
};
