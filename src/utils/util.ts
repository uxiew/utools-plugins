//@ts-nocheck

//导插件包
import dayjs from 'dayjs';
//导相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime';
import { RequestHeaders } from 'electron';
//导国际化插件i18n
dayjs.extend(relativeTime);

// dayjs,moment 作用：快捷转换时间格式，dayjs更轻量
// dayjs 默认转换时间格式的功能，依赖插件获取更多功能
export function timeAgo(strDate: string) {
  // 实现获取相对时间逻辑  中文格式  相对时间-距离现在 strDate-字符串格式转时间格式
  return dayjs().to(dayjs(strDate));
}

// 数字转为千位表示法
export function toThousands(n: string | numebr) {
  let num = (n || '-').toString(),
    result = '';
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return result;
}

// 清理html结构，修复图片显示路径
export function runkitCleanHTML(htmlText: string) {
  if (!htmlText) return '❌Error Network！No Data Returned！';
  let fixHtml = htmlText
    .match(/body>([\s\S]*)<\/body/)[1] //获取body内容
    .replace(/href\s*=\s*".+?"/g, 'href="#"') // 清楚 href 链接
    .replace(/<script\b[^>]*>[\s\S]*<\/script>/g, ''); //清除body内 script

  if (/<div id="img">/.test(fixHtml))
    fixHtml = fixHtml.replace(
      /<img src="/,
      '<img src="https://source.runkitcdn.com'
    ); //修复 image 图片显示

  return fixHtml.match(/views">([\s\S]*)<\/div>/)![1]; // 匹配小组内容
}

function filterATag(msg: string) {
    return msg.replace(/<a[\W\w]*?>/gim, '').replace(/<\/a>|\s+|<li>/ig, '').replace(/<\/li>/ig, '\n');
}

// youdaoFanyi
export function getTrans ( htmlText: string , text:string){
	let transResult =  '';
	//读音 英/美
	const reg_ecContentWrp = /_contentWrp"[\W\w]*<ul>([\W\w]*?)<\/ul/im;  
	const reg_fanyiContentWrp = /翻译结果[\W\w]*?trans-container[\W\w]*?<p>[\W\w]*?<\/p>\s*\n*<p>([\W\w]*?)<\/p>/im;  
	const str_ecCcontentWrp = reg_ecContentWrp.exec(htmlText)
	const str_fanyiContentWrp = reg_fanyiContentWrp.exec(htmlText)
	
	if( str_ecCcontentWrp != null){
        transResult += filterATag( str_ecCcontentWrp[1] );  // 单词翻译
	}
	if( str_fanyiContentWrp != null){
		transResult += str_fanyiContentWrp[1];     //长句翻译
	}
	return transResult.indexOf('<licl') ===0 ? text : transResult;
}

export function getTransAudio (htmlText: string, text:string){
		let phonetic = '';
        //读音 英/美
        const reg_audio = /英[\W\w]*?phonetic">([\W\w]*?)<\/span[\W\w]*?data-rel="([\W\w]*?)"[\W\w]*?美[\W\w]*?phonetic">([\W\w]*?)<\/span[\W\w]*?data-rel="([\W\w]*?)"/im;
        const str_audio = reg_audio.exec(htmlText)
       
        if(str_audio === null){
			//读音 单个读音
			let reg_audio = /phonetic">([\W\w]*?)<\/span[\W\w]*?data-rel="([\W\w]*?)"/im;
			let str_audio = reg_audio.exec(htmlText)
			if(str_audio != null){
			  return {
				KK:{
					phonetic:str_audio[1],
					audio:str_audio[2]
				 },
				BE:{
					phonetic:'',
					audio:''
				}
			 }
			}else{
				return {
					KK:{
						phonetic:'',
						// audio:`https://translate.google.cn/translate_tts?idx=0&client=t&ttsspeed=1&tl=en&tk=572383.975253&q=${text}`
						audio:`https://dict.youdao.com/dictvoice?audio=${text}`
					 },
					BE:{
						phonetic:'',
						audio:'' 
					}
				}
			}
		}
		
		return {
			BE:{
				phonetic:str_audio[1],
				audio:str_audio[2]
			},
			KK:{
				phonetic:str_audio[3],
				audio:str_audio[4]
			}
		}
 }

export function fetch(
  apiUrl: string,
  headers?: RequestHeaders,
  timeout?: number = 5000
): Promise<Response> {
  //ahutor:herbert qq:464884492
  let controller = new AbortController();
  let signal = controller.signal;

  const timeoutPromise = timeout => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(
          new Response(
            `{"error":"504 搜索超时,请重试!","status":504,"data":null,"url":"${apiUrl}"}`,
            {
              status: 504,
              statusText: 'timeout2',
              url: apiUrl
            }
          )
        );
        controller.abort(); // 终止请求
      }, timeout);
    });
  };
  const requestPromise = (url: string) => {
    return window.fetch(url, {
      signal,
      ...headers
    });
  };

  return Promise.race([timeoutPromise(timeout), requestPromise(apiUrl)])
    .then(resp => {
      return resp;
    })
    .catch(error => {
      return error;
    });
}

/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
export function _debounce(func, delay = 500): Function {
  return (...rest) => {
    //获取函数的作用域和变量
    let that = this;
    //每次事件被触发，都会清除当前的timeer，然后重写设置超时调用
    clearTimeout(func.id);
    func.id = setTimeout(function() {
      func.apply(that, rest);
    }, delay);
  };
}

/**
 * 函数节流
 * @param fn
 * @param interval
 * @returns {Function}
 * @constructor
 */
export const _throttle = (fn, interval = 500) => {
  let last;
  let timer;
  return function() {
    let args = arguments;
    let now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        fn.apply(this, args);
      }, interval);
    } else {
      last = now;
      fn.apply(this, args);
    }
  };
};
