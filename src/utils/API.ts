/**
 * 接口来自多个网站！
 * 列表建议：https://www.npmjs.com 、https://runkit.com/api
 * 内容：npm.io
 * 其他带参考：https://openbase.io/、https://www.algolia.com/、https://api.npms.io
 *
 */

import { _debounce, fetch } from './util';

const npmioUrl = 'https://npm.io/api';
const runkitUrl = 'https://runkit.com/api';
const npmjsUrl = 'https://www.npmjs.com/search';
const githubUrl = 'https://api.github.com'; //https://api.github.com/repos/bitinn/node-fetch
const per_page = 10;

async function ajax(apiUrl: string) {
  return await fetch(apiUrl, {
    headers: {
      'x-spiferack': '1'
    }
  }).then(res => {
    return res.json(); // maybe:ok: false  status: 504
  });
}

/**
 * @description 优先使用 npmjsUrl,若没有数据返回，再使用 runkitUrl 搜索！不使用竞速方式 `Promise.all()`
 * @param npmPkgStr
 */
export const getSuggestionList = async (
  npmPkgStr: string,
  url?: string
): Promise<any[]> => {
  const NODATA = [{ error: true }];
  if (!npmPkgStr) return NODATA;
  const searchStr = npmPkgStr.trim().replace('/', '-');
  let apiUrl = `${npmjsUrl}?q=${searchStr}&size=${per_page}&ranking=popularity`;
  let runUrl = `${runkitUrl}/search/modules/${searchStr}?page=1&size=${per_page}`;
  let npmioApi = `${npmioUrl}/v1/search?query=${searchStr}&page=1&per_page=${per_page}`;
  /**
   * 优先使用 npmjsUrl
   * 注意 ⚠️ 单个字母搜索出来会是确定的github上单个项目
   */

  let tempArray: any[] = [];
  let data = await ajax(url ? url : apiUrl);

  //  超时，直接结束了？data === undefined
  // npmjs 出错，比如查询了特殊字符，返回带有 error
  if (data.status == 504 || !data || data.error) {
    if (data.url === apiUrl) {
      return (tempArray = await getSuggestionList(npmPkgStr, runUrl));
    }
    if (data.url === runUrl) {
      return (tempArray = await getSuggestionList(npmPkgStr, npmioApi));
    } else {
      return NODATA;
    }
  }

  let res: any[] = data.objects
    ? data.objects
    : data.items
    ? data.items
    : data.list;

  // @italk/test1  copy webpak
  if (res && !res.length) {
    apiUrl = data.objects ? runUrl : data.items ? npmioApi : '';
    if (!apiUrl) return NODATA;
    apiUrl && (tempArray = await getSuggestionList(npmPkgStr, apiUrl));
  } else {
    if (data.list) {
      // npmio
      tempArray = data.list;
    } else if (data.objects) {
      //npmjs
      res.forEach((item: any) => {
        tempArray.push(item.package);
      });
    } else if (data.package) {
      tempArray.push(data.packageVersion);
    } else {
      res.forEach((item: any) => {
        //runkit
        tempArray.push(item._source);
      });
    }
  }

  // =======返回前，添加 空数据标识======
  return tempArray.length ? tempArray : NODATA;
};

// 按流行度排序
export const getKeyWordList = async (keyword: string) => {
  const list = await fetch(
    `${npmjsUrl}?q=keywords:${keyword}&ranking=popularity`,
    {
      headers: {
        'x-spiferack': '1'
      }
    }
  ).then(res => {
    return res.ok && res.json();
  });

  let tempArray: any[] = [];
  list.objects.forEach((item: any) => {
    tempArray.push(item.package);
  });
  return tempArray;
};

export async function getPkgInfo(npmPkgStr: string): Promise<any> {
  return await fetch(`${npmioUrl}/v1/package/${npmPkgStr}`).then(
    res => {
      // https://npm.io/api/v1/package/test0515
      return res.json();
    },
    err => {
      // console.log("错误！", err);
      return Promise.reject({ error: err.status });
    }
  );
}

/*
 * 接口参考
 * https://runkit.com/api/search/modules/%E5%BE%AE%E4%BF%A1?page=2&size=10
 * https://npm.runkit.com/?q=typescript
 * 在新建一个功能，通过 https://runkit.com/api/npm/info/touchui-wx-cli?version=2.6.0 查看库的源码
 **/
//===== from runkit  info ====

export async function getPkgSourceInfo(packageName: string, version: string) {
  return await fetch(
    `${runkitUrl}/npm/info/${packageName}?version=${version}`
  ).then(
    res => {
      return res.json();
    },
    err => {
      return Promise.reject({ error: err.status });
    }
  );
}
export async function getPkgFileSource(pkgName: string, pkgFilePath: string) {
  return await fetch(
    `https://source.runkitcdn.com/npm/${pkgName +
      pkgFilePath}?engine=10.x.x&t=${new Date().getTime()}`
  ).then(
    res => {
      return res.text();
    },
    err => {
      return Promise.reject({ error: err.status });
    }
  );
}

// export const getList = (getSuggestionList) as (
//   arg: string
// ) => ListData[];
