import createPlayer from 'audio-player';
import { _debounce, fetch, getTrans, getTransAudio } from './util';

const algoliaUrl = 'https://ofcncog2cu-3.algolianet.com/1/indexes/*/queries'; // 3比较快速
const npmioUrl = 'https://npm.io/api/v1/';
const runkitUrl = 'https://runkit.com/api';
const npmjsUrl = 'https://www.npmjs.com/search';
const youdaoApi = 'https://m.youdao.com/dict?le=eng&q=';
//const youdaoApi = 'http://dict.youdao.com';
const githubUrl = 'https://api.github.com';
const per_page = 20;

async function ajax(apiUrl: string, options?: object) {
  const opts =
    apiUrl.indexOf(algoliaUrl) === 0
      ? options
      : {
          headers: {
            'x-spiferack': '1'
          }
        };
  return fetch(apiUrl, opts, 3000).then(res => {
    return res.json(); // maybe:ok: false  status: 504
  });
}

export const commonKeywords = async (): Promise<[]> => {
  const { list } = await fetch(
    `${npmioUrl}keywords?page=1&per_page=${per_page + 40}`
  ).then(res => {
    return res.json();
  });
  return list || [];
};

/**
 * @description 优先使用 npmjsUrl,若没有数据返回，再使用 runkitUrl 搜索！不使用竞速方式 `Promise.all()`
 * @param npmPkgStr
 */
export const getSuggestionList = async (
  npmPkgStr: string,
  url?: string
): Promise<any[] | {}> => {
  const NODATA = { error: true };
  if (!npmPkgStr) return NODATA;
  // const searchStr = npmPkgStr.trim().replace('/', '-');
  const searchStr = encodeURIComponent(npmPkgStr);

  /**
   * 优先使用 algoliaUrl
   * 注意 npmjsApi 单个字母搜索出来会是确定的github上单个项目
   */
  let api = `${algoliaUrl}?x-algolia-agent=Algolia%20for%20JavaScript%20(4.2.0)%3B%20Browser%20(lite)%3B%20JS%20Helper%20(3.1.1)%3B%20react%20(16.13.1)%3B%20react-instantsearch%20(6.6.0)&x-algolia-api-key=f54e21fa3a2a0160595bb058179bfb1e&x-algolia-application-id=OFCNCOG2CU`;
  const npmjsApi = `${npmjsUrl}?q=${searchStr}&size=${per_page}&ranking=popularity`;
  const runUrl = `${runkitUrl}/search/modules/${searchStr}?page=1&size=${per_page}`;
  const npmioApi = `${npmioUrl}search?query=${searchStr}&page=1&per_page=${per_page}`;

  const options = {
    method: 'POST',
    mode: 'cors', // 跨域请求
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      requests: [
        {
          indexName: 'npm-search',
          params: `highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&hitsPerPage=${per_page}&page=0&analyticsTags=%5B%22yarnpkg.com%22%5D&attributesToRetrieve=%5B%22deprecated%22%2C%22description%22%2C%22downloadsLast30Days%22%2C%22homepage%22%2C%22humanDownloadsLast30Days%22%2C%22keywords%22%2C%22license%22%2C%22modified%22%2C%22name%22%2C%22owner%22%2C%22repository%22%2C%22types%22%2C%22version%22%5D&attributesToHighlight=%5B%22name%22%2C%22description%22%2C%22keywords%22%5D&query=${searchStr}&maxValuesPerFacet=10&facets=%5B%22keywords%22%2C%22keywords%22%2C%22owner.name%22%5D&tagFilters`
        }
      ]
    })
  };

  let data = await ajax(url ? url : api, options);

  let tempArray: any = [];
  //  超时，直接结束了？data === undefined
  // npmjs 出错，比如查询了特殊字符，返回带有 error
  if (data.status == 403 || data.status == 504 || !data || data.error) {
    if (data.url === api) {
      return (tempArray = await getSuggestionList(npmPkgStr, npmjsApi));
    }
    if (data.url === npmjsApi) {
      return (tempArray = await getSuggestionList(npmPkgStr, runUrl));
    }
    if (data.url === runUrl) {
      return (tempArray = await getSuggestionList(npmPkgStr, npmioApi));
    } else {
      return NODATA;
    }
  }

  let res: any[] =
    data.results && data.results[0]
      ? data.results[0].hits
      : data.objects
      ? data.objects
      : data.items
      ? data.items
      : data.list;

  // @italk/test1  copy webpak
  if (res && !res.length) {
    api = data.results
      ? npmjsApi
      : data.objects
      ? runUrl
      : data.items
      ? npmioApi
      : '';
    if (!api) return NODATA;
    api && (tempArray = await getSuggestionList(npmPkgStr, api));
  } else {
    if (data.results && data.results[0]) {
      // alg
      tempArray = res;
    } else if (data.list) {
      // npmio
      tempArray = data.list;
    } else if (data.objects) {
      // npmjs
      res.forEach((item: any) => {
        tempArray.push(item.package);
      });
    } else if (data.package) {
      // npmjs 直接精确对应返回项目
      tempArray.push(data.packageVersion);
    } else {
      //runkit
      res.forEach((item: any) => {
        tempArray.push(item._source);
      });
    }
  }
  // =======返回前，添加 空数据标识======
  return tempArray.length ? tempArray : NODATA;
};

/**
 *  搜索关键词 按流行度排序
 * https://npm.io/api/v1/search?query=keyword%3Aangular&page=1&per_page=${per_page}
 * @param {keyword} 'keywords:async'
 */
export const getKeyWordList = async (keyword: string) => {
  const list = await fetch(`${npmjsUrl}?q=${keyword}&ranking=popularity`, {
    headers: {
      'x-spiferack': '1'
    }
  }).then(res => {
    return res.ok && res.json();
  });

  let tempArray: any[] = [];
  list &&
    list.objects.forEach((item: any) => {
      tempArray.push(item.package);
    });
  return tempArray;
};

// 获取包信息
export async function getNpmioDetail(npmPkgStr: string): Promise<any> {
  return await fetch(`${npmioUrl}package/${npmPkgStr}`).then(
    res => {
      return res.json();
    },
    err => {
      // console.log("错误！", err);
      return Promise.reject({ error: err.status });
    }
  );
}

// 获取包信息
export async function getPkgDetail(npmPkgStr: string): Promise<any> {
  //   const resultPromise = await fetch(`${npmioUrl}/v1/package/${npmPkgStr}`).then(
  const url = `https://ofcncog2cu-3.algolianet.com/1/indexes/npm-search/`;
  const pkgPromise = await fetch(
    `${url +
      encodeURIComponent(
        npmPkgStr
      )}?x-algolia-agent=Algolia%20for%20JavaScript%20(4.2.0)%3B%20Browser`,
    {
      headers: {
        'x-algolia-api-key': `f54e21fa3a2a0160595bb058179bfb1e`,
        'x-algolia-application-id': `OFCNCOG2CU`
      }
    }
  ).then(
    res => {
      return res.json();
    },
    err => {
      // console.log("错误！", err);
      return Promise.reject({ error: err.status });
    }
  );
  return pkgPromise;
}

// =======翻译查询======
export const translateYD = async (selectText: string): Promise<any> => {
  const text = selectText.trim();
  // 英文校验规则
  // -------------！！！注意：转义特殊字符'-'
  // const regEn = /[`~!@#$%^&*_?()<->:"{},.\\/;'[\]]/im
  // 中文校验规则
  const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

  if (!text || regCn.test(text)) return;
  const data = await fetch(youdaoApi + text).then(res => {
    return res.text();
  });

  const { KK, BE } = getTransAudio(data, text);
  const player = new createPlayer();
  // 直接播放语音
  try {
    player.play(BE.audio ? BE.audio : KK.audio);
  } catch (error) {
    // console.log('语音', error);
  }
  return (
    (BE.phonetic
      ? `英${BE.phonetic} 美${KK.phonetic} \n`
      : KK.phonetic
      ? `美${KK.phonetic} \n`
      : '') + getTrans(data, text)
  );
};

/**
export const translateYD = async (selectText: string): Promise<any> => {
  const notAWord = /\s+/.test(selectText.trim());
  const { data,result, fanyi } = await fetch(
    notAWord
      ? `${youdaoApi}/jsonapi?jsonversion=2&client=mobile&dicts=${encodeURIComponent(
          '{"count":99,"dicts":[["fanyi"]]}'
        )}&q=${selectText}`
      : `${youdaoApi}/suggest?q=${selectText}&le=eng&num=1&doctype=json`
  ).then(res => {
    return res.json();
  });
  return data&&result.code ===200 ? data.entries[0].explain : fanyi ? fanyi.tran : selectText;
};
*/

/*
 * 接口参考
 * https://runkit.com/api/search/modules/%E5%BE%AE%E4%BF%A1?page=2&size=10
 * https://npm.runkit.com/?q=typescript
 * 通过 https://runkit.com/api/npm/info/touchui-wx-cli?version=2.6.0 查看库的源码
 * 或者这也很全：https://yarnpkg.cn/package/snapdragon-node?files
 **/
//===== from runkit  info ====
// data.jsdelivr.com/v1/package/npm/aimer@2.8.0

export async function getSourceStructure(packageName: string, version: string) {
  // return fetch(`${runkitUrl}/npm/info/${packageName}?version=${version}`).then(
  return fetch(
    `https://data.jsdelivr.com/v1/package/npm/${packageName}@${version}`
  ).then(
    async res => {
      const { files, message, status } = await res.json();
      return {
        directoryListing: files,
        unavailable: !!status,
        message
      };
    },
    err => {
      return Promise.reject({ error: err.status });
    }
  );
}

/**
 * @description 获取某个文件源码
 */
export async function getPkgFileSource(pkg: any, pkgFilePath: string) {
  const { name, version } = pkg;
  const api = `https://cdn.jsdelivr.net/npm/${name}@${version}${pkgFilePath}`;
  return await fetch(api).then(
    res => {
      return res.text();
    },
    err => {
      return Promise.reject({ error: err.status });
    }
  );
}

// ForbesLindesay/sync-request/
export async function getGhFile(
  repoUrl: string,
  version: string,
  fileName = 'readme.md'
) {
  if (!repoUrl) return '';
  const githubStr = repoUrl.replace('https://github.com/', '');

  const api = `https://cdn.jsdelivr.net/gh/${githubStr}@${version}/${fileName}`;
  return fetch(api)
    .then(res => {
      return res.text();
    })
    .catch(err => {
      console.log('getGhFile', err);
      return Promise.reject({ error: err.status });
    });
}

export async function getREADMEFile(
  { name, version }: { name: string; version: string },
  fileName = 'readme.md'
) {
  let result = Promise.resolve('❌: 没有找到 README 文件！😢');
  if (!name) return result;

  const api = `https://cdn.jsdelivr.net/npm/${name}@${version}/`;

  let textArr =
    (await fetch(api).then(async res => {
      let str = await res.text();

      return str.match(/">(.*)<\/a><\/td>/g);
    })) || [];

  // 去除后缀哦
  const fileStr = fileName.split(/\./);

  // const targetName = fileName.replace(/\./g, '\\.');

  //@ts-ignore
  for (const str of textArr) {
    const matches = new RegExp(
      `${fileStr[0]}|${fileStr[0].toLocaleUpperCase()}`,
      'g'
    ).exec(str);
    if (!matches) continue;
    const mdFileName = /=".*">(.+?)<\/a>/g.exec(matches.input)![1];

    // console.log(matches[0] + '.' + fileStr[1], fileStr);
    result = fetch(api + mdFileName)
      .then(res => res.text())
      .catch(err => {
        console.log('getGhFile', err);
        return Promise.reject({ error: err.status });
      });
  }

  return result;
}
