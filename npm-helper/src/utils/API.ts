import createPlayer from 'audio-player'

import { _debounce, fetch, getTrans, getTransAudio } from './util'

const algoliaUrl = 'https://ofcncog2cu-3.algolia.net/1/indexes/*/queries' // 3比较快速
const npmioUrl = 'https://npm.io/api'
const runkitUrl = 'https://runkit.com/api'
const npmjsUrl = 'https://www.npmjs.com/search'
const youdaoApi = 'https://m.youdao.com/dict?le=eng&q='
//const youdaoApi = 'http://dict.youdao.com';
const githubUrl = 'https://api.github.com' //https://api.github.com/repos/bitinn/node-fetch
const per_page = 10

async function ajax(apiUrl: string, options?: object) {
  const opts =
    apiUrl.indexOf(algoliaUrl) === 0
      ? options
      : {
          headers: {
            'x-spiferack': '1'
          }
        }
  return await fetch(apiUrl, opts, 3000).then(res => {
    return res.json() // maybe:ok: false  status: 504
  })
}

export const commonKeywords = async (): Promise<[]> => {
  const { list } = await fetch(`${npmioUrl}/v1/keywords?page=1&per_page=90`).then(res => {
    return res.json()
  })
  return list || []
}

/**
 * @description 优先使用 npmjsUrl,若没有数据返回，再使用 runkitUrl 搜索！不使用竞速方式 `Promise.all()`
 * @param npmPkgStr
 */
export const getSuggestionList = async (npmPkgStr: string, url?: string): Promise<any[] | {}> => {
  const NODATA = { error: true }
  if (!npmPkgStr) return NODATA
  const searchStr = npmPkgStr.trim().replace('/', '-')

  /**
   * 优先使用 algoliaUrl
   * 注意 npmjsApi 单个字母搜索出来会是确定的github上单个项目
   */
  let api = `${algoliaUrl}?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.27.1%3Breact-instantsearch%205.2.0-beta.2%3BJS%20Helper%202.26.1&x-algolia-api-key=f54e21fa3a2a0160595bb058179bfb1e&x-algolia-application-id=OFCNCOG2CU`
  const npmjsApi = `${npmjsUrl}?q=${searchStr}&size=${per_page}&ranking=popularity`
  const runUrl = `${runkitUrl}/search/modules/${searchStr}?page=1&size=${per_page}`
  const npmioApi = `${npmioUrl}/v1/search?query=${searchStr}&page=1&per_page=${per_page}`

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
          params: `highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&hitsPerPage=${per_page}&page=0&analyticsTags=%5B%22yarnpkg.com%22%5D&attributesToRetrieve=%5B%22deprecated%22%2C%22description%22%2C%22downloadsLast30Days%22%2C%22homepage%22%2C%22humanDownloadsLast30Days%22%2C%22keywords%22%2C%22license%22%2C%22modified%22%2C%22name%22%2C%22owner%22%2C%22repository%22%2C%22types%22%2C%22version%22%5D&attributesToHighlight=%5B%22name%22%2C%22description%22%2C%22keywords%22%5D&query=${searchStr}&maxValuesPerFacet=10&facets=%5B%22keywords%22%2C%22keywords%22%2C%22owner.name%22%5D&tagFilters=`
        }
      ]
    })
  }

  let data = await ajax(url ? url : api, options)

  let tempArray: any = []

  //  超时，直接结束了？data === undefined
  // npmjs 出错，比如查询了特殊字符，返回带有 error
  if (data.status == 504 || !data || data.error) {
    if (data.url === api) {
      return (tempArray = await getSuggestionList(npmPkgStr, npmjsApi))
    }
    if (data.url === npmjsApi) {
      return (tempArray = await getSuggestionList(npmPkgStr, runUrl))
    }
    if (data.url === runUrl) {
      return (tempArray = await getSuggestionList(npmPkgStr, npmioApi))
    } else {
      return NODATA
    }
  }

  let res: any[] = data.results && data.results[0] ? data.results[0].hits : data.objects ? data.objects : data.items ? data.items : data.list

  // @italk/test1  copy webpak
  if (res && !res.length) {
    api = data.results ? npmjsApi : data.objects ? runUrl : data.items ? npmioApi : ''
    if (!api) return NODATA
    api && (tempArray = await getSuggestionList(npmPkgStr, api))
  } else {
    if (data.results && data.results[0]) {
      // alg
      tempArray = res
    } else if (data.list) {
      // npmio
      tempArray = data.list
    } else if (data.objects) {
      // npmjs
      res.forEach((item: any) => {
        tempArray.push(item.package)
      })
    } else if (data.package) {
      // npmjs 直接精确对应返回项目
      tempArray.push(data.packageVersion)
    } else {
      //runkit
      res.forEach((item: any) => {
        tempArray.push(item._source)
      })
    }
  }
  // =======返回前，添加 空数据标识======
  return tempArray.length ? tempArray : NODATA
}

/**
 *  搜索关键词 按流行度排序
 * https://npm.io/api/v1/search?query=keyword%3Aangular&page=1&per_page=20
 * @param {keyword} 'keywords:async'
 */
export const getKeyWordList = async (keyword: string) => {
  const list = await fetch(`${npmjsUrl}?q=${keyword}&ranking=popularity`, {
    headers: {
      'x-spiferack': '1'
    }
  }).then(res => {
    return res.ok && res.json()
  })

  let tempArray: any[] = []
  list &&
    list.objects.forEach((item: any) => {
      tempArray.push(item.package)
    })
  return tempArray
}

// 获取包信息
export async function getPkgInfo(npmPkgStr: string): Promise<any> {
  const res = await fetch(`${npmioUrl}/v1/package/${npmPkgStr}`).then(
    res => {
      return res.json()
    },
    err => {
      // console.log("错误！", err);
      return Promise.reject({ error: err.status })
    }
  )
  return res
}

/*
 * 接口参考
 * https://runkit.com/api/search/modules/%E5%BE%AE%E4%BF%A1?page=2&size=10
 * https://npm.runkit.com/?q=typescript
 * 通过 https://runkit.com/api/npm/info/touchui-wx-cli?version=2.6.0 查看库的源码
 * 或者这也很全：https://yarnpkg.com/package/snapdragon-node?files
 **/
//===== from runkit  info ====

export async function getPkgSourceInfo(packageName: string, version: string) {
  return await fetch(`${runkitUrl}/npm/info/${packageName}?version=${version}`).then(
    res => {
      return res.json()
    },
    err => {
      return Promise.reject({ error: err.status })
    }
  )
}
export async function getPkgFileSource(pkg: any, pkgFilePath: string) {
  const { name, version } = pkg
  const api = `https://cdn.jsdelivr.net/npm/${name}@${version}${pkgFilePath}`
  return await fetch(api).then(
    res => {
      return res.text()
    },
    err => {
      return Promise.reject({ error: err.status })
    }
  )
}

// =======翻译查询======
export const translateYD = async (selectText: string): Promise<any> => {
  const text = selectText.trim()
  // 英文校验规则
  // -------------！！！注意：转义特殊字符'-'
  // const regEn = /[`~!@#$%^&*_?()<->:"{},.\\/;'[\]]/im
  // 中文校验规则
  const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im

  if (!text || regCn.test(text)) return
  const data = await fetch(youdaoApi + text).then(res => {
    return res.text()
  })

  const { KK, BE } = getTransAudio(data, text)
  const player = new createPlayer()
  // 直接播放语音
  player.play(BE.audio ? BE.audio : KK.audio)
  return (BE.phonetic ? `英${BE.phonetic} 美${KK.phonetic} \n` : KK.phonetic ? `美${KK.phonetic} \n` : '') + getTrans(data, text)
}

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
