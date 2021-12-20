import filesize from 'filesize';

export function deepCopy<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (obj instanceof Date) return new Date(obj) as any;

  if (Array.isArray(obj)) {
    const res: any = [];
    for (let i = 0; i < obj.length; i++) {
      res.push(deepCopy(obj[i]));
    }
    return res;
  }

  const res: any = {};

  for (const key in obj) {
    res[key] = deepCopy(obj[key]);
  }
  return res;
}

export function openFile(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const filePaths = window.utools.showOpenDialog({
      filters: [{ name: 'plugin.json', extensions: ['asar'] }],
      properties: ['openFile', 'showHiddenFiles'],
    });
    if (filePaths && filePaths.length) {
      resolve(filePaths[0]);
    } else {
      resolve('');
    }
  });
}

export const formatSize = filesize;
