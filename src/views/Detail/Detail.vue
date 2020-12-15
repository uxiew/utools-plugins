<template>
  <section
    id="post_top"
    class="post-single"
  >
    <FileBrowser
      v-if="showSourceBrowser"
      search="true"
      :directory-listing="pkgSourceDirList"
      @get-path="getFileSource($event)"
    ></FileBrowser>
    <van-skeleton
      title
      :row="10"
      :loading="skeLoading"
    >
      <van-empty
        v-if="pkgDetail.error"
        image="error"
        :description="pkgDetail.error"
      />
      <div
        v-else
        class="article post-content"
      >
        <div class="post-content-top">
          <!-- 头部 -->
          <header class="post-title">
            <div class="date">
              {{ titleDate }}
            </div>
            <h1
              class="header header__primary"
              @dblclick="showPkgFBrowser"
            >
              {{ title }}
            </h1>
          </header>
          <div class="post-copy">
            <label for="install-input">Install</label>
            <div class="post-copy__input">
              <input
                id="install-input"
                type="text"
                readonly=""
                :value="installDesc"
              />
              <a
                class="post-copy-link"
                @click.prevent="copyInstall()"
              />
            </div>
            <div class="runkit-btn">
              <a
                class="truncate"
                rel="noopener noreferrer nofollow"
                @click.prevent="runInRunKit()"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="terminal"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                >
                  <path
                    fill="currentColor"
                    d="M257.981 272.971L63.638 467.314c-9.373 9.373-24.569 9.373-33.941 0L7.029 444.647c-9.357-9.357-9.375-24.522-.04-33.901L161.011 256 6.99 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L257.981 239.03c9.373 9.372 9.373 24.568 0 33.941zM640 456v-32c0-13.255-10.745-24-24-24H312c-13.255 0-24 10.745-24 24v32c0 13.255 10.745 24 24 24h304c13.255 0 24-10.745 24-24z"
                  />
                </svg>
                <strong>Try</strong>
                on RunKit
              </a>
            </div>
          </div>
          <!-- 简单表格 -->
          <div class="post-table statistics">
            <div class="post-table-head">
              <div class="post-table-cell">
                <span>Weekly downloads</span>
                <div class="post-table-content">
                  {{ pkgDetail.downloads | convertToThousands }}
                </div>
              </div>
              <div class="post-table-cell">
                <span>License</span>
                <div class="post-table-content">
                  {{ (pkgDetail.license || '-') | truncate}}
                </div>
              </div>
              <div class="post-table-cell">
                <span>Repository</span>
                <div class="post-table-content">
                  <a
                    v-if="repoUrl"
                    :href="repoUrl"
                    @click.prevent="openUrl(repoUrl)"
                  >
                    github
                  </a>
                  <span v-else>-</span>
                </div>
              </div>
              <div class="post-table-cell">
                <span>Last release</span>
                <div class="post-table-content">
                  {{ pkgDetail.modified | timeAgo }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <article class="post-content">
          <!-- ✓ GOOD -->
          <div
            class="markdown"
            eslint-disable-next-line
            @click="openUrl($event)"
            v-html="pkgDetail.readme"
          ></div>
          <!-- 生成TOC -->
          <AutoMenu
            v-if="!skeLoading"
            level-tags="h1,h2,h3,h4"
            selector=".markdown"
          />
          <!-- 弹出源码区 -->
          <van-popup
            v-model="showSourceViewer"
            closeable
            position="right"
            :style="{ width: '90vw' }"
          >
            <button class="copy-button">Copy</button>
            <div
              class="source-viewer"
              v-html="sourceHTML"
            ></div>
          </van-popup>

          <!-- 底部关键字和相关库 -->
          <Tabs
            :keywords="pkgDetail.keywords"
            :dependents="pkgDetail.dependents"
            :dependencies="pkgDetail.dependencies"
            :versions="pkgDetail.versions"
            :get-info="ajaxInfo"
          />
        </article>
      </div>
    </van-skeleton>
  </section>
</template>

<script lang="ts">
// https://github.com/vst93/myDictionary-uToolsPlugin/blob/master/assets/index.js
import { Vue, Component } from 'vue-property-decorator';
import {
  getPkgInfo,
  getPkgSourceInfo,
  getPkgFileSource
} from '../../utils/API';
import { timeAgo, toThousands, runkitCleanHTML } from '../../utils/util';
import marked from 'marked';
import prism from 'prismjs';
import FileBrowser from '../../components/FileBrowser/index.vue';
import AutoMenu from '../../components/AutoMenu/index.vue';
import Tabs from './Tabs.vue';

interface PkgDataType {
  name: string;
  description?: string;
  license?: string;
  modified?: string;
  readme?: string;
  downloads?: number;
  keywords?: string[];
  dependents?: string[];
  dependencies?: string[];
  repository?: { type: string; url: string };
  version?: string;
  versions?: { [prop: string]: string; created: string; modified: string };
  error?: boolean;
  [prop: string]: any;
}
interface PkgSourceInfo {
  canBeDirectlyRequired?: boolean;
  description?: string;
  directoryListing: [];
  keywords?: string;
  homepage?: string | null;
  license?: string | null;
  packageName?: string | null;
}

let BigFileCache: {
  [prop: string]: string;
} = {};
/* eslint-disable no-undef */
@Component({
  name: 'Detail',
  components: {
    FileBrowser,
    AutoMenu,
    Tabs
  },
  filters: {
    convertToThousands: (val: string | number = '-') => {
      return toThousands(val);
    },
    truncate: (text: string )=>{
		const maxwidth = 20;
		if(text.length> maxwidth)
		  return text.substring(0,maxwidth)+'...';
		return text
    }
  }
})
export default class Detail extends Vue {
  private skeLoading: boolean = true;
  private pkgDetail: PkgDataType = {
    name: '',
    repository: { type: 'git', url: '' },
    keywords: [],
    dependents: [],
    dependencies: []
  };
  private pkgSourceDirList!: [];
  private sourceHTML!: string;

  private pkgSourceUnavailable: boolean = false;
  private showSourceBrowser: boolean = false;
  private showSourceViewer: boolean = false;

  created() {
    marked.setOptions({
      highlight: function(code, lang) {
        if (prism.languages[lang]) {
          return prism.highlight(code, prism.languages[lang], lang);
        } else {
          return code;
        }
      }
    });

    this.utoolSetInput();
  }

  private utoolSetInput() {
    utools.setSubInput(({ text }) => {
      utools.findInPage(text);
      this.$store.dispatch('changeText', { searchText: text });
      // highlightManual('#manualBody', text);
    }, '搜索全文，选中文本回车键查询，T翻译；Tab切换界面');
  }

  get queryPkgName() {
    return this.$route.params.name;
  }

  get titleDate() {
    const relTime = timeAgo(this.pkgDetail.modified!);
    const author = this.repoUrl.match(/com\/(.+)\//);
    return `${this.pkgDetail.version} • Published ${relTime}${
      author ? ' by ' + author[1] : ''
    }`; //1.2.6 • Published 4 years ago
  }

  get title() {
    const { name, version } = this.pkgDetail;
    return `${name} v${version}`; //1.2.6 • Published 4 years ago
  }

  get installDesc() {
    return `npm i ${this.pkgDetail.name}`;
  }

  // 处理一下
  get repoUrl() {
    let url =
      (this.pkgDetail.repository && this.pkgDetail.repository.url) || '';
    if (url) {
      url = url.replace(/(git.*github|\.git)/g, (match, p1, index)=>{
	  return index === 0 ? 'https://github' : ''
	});
    }
    return url;
  }

  copyInstall() {
    utools.copyText(this.installDesc);
  }
  runInRunKit() {
    utools.shellOpenExternal(`https://runkit.com/npm/${this.pkgDetail.name}`);
  }

  openUrl(e: any) {
    switch (typeof e) {
      case 'string':
        utools.shellOpenExternal(e);
        break;
      default:
        if (e.target.tagName === 'A') {
          const { href } = e.target;
          href.startsWith('http') && utools.shellOpenExternal(href);
          !href.startsWith('http') && href.toLocaleLowerCase().endsWith('.md') && utools.shellOpenExternal(`${this.repoUrl}/blob/master/${href.replace(/file.*\//,'')}`);
        }
        break;
    }
  }

  // ===============

  resetDetail() {
    this.skeLoading = true;
    this.pkgSourceUnavailable = false;
    this.showSourceBrowser = false;
    this.showSourceViewer = false;
  }
  async ajaxInfo(params: string) {
    this.resetDetail();
    this.pkgDetail = await getPkgInfo(params as string);
    this.skeLoading = false;
    this.pkgDetail.readme = marked.parse(
      this.pkgDetail.readme || '错误❌: 没有找到 README 文件！😢'
    );
    // -
    const elTarget = document.querySelector('#post_top');
    elTarget && elTarget.scrollIntoView(true);
  }

  async mounted() {
    utools.setExpendHeight(700);
    await this.ajaxInfo(
      (this.queryPkgName as string) || (this.pkgDetail.name as string)
    );
  }

  // dbClick pkg name to show source directory
  async showPkgFBrowser() {
    const {
      pkgSourceDirList = [],
      pkgDetail: { name, version },
      pkgSourceUnavailable
    } = this;
    if (pkgSourceUnavailable) return;
    if (!pkgSourceDirList.length) {
      const { directoryListing = [], unavailable } = await getPkgSourceInfo(
        name,
        version!
      );
      this.pkgSourceUnavailable = !!unavailable;
      this.pkgSourceDirList = directoryListing;
    }
    // 切换显示

    this.showSourceBrowser =
      this.pkgSourceDirList.length && !pkgSourceUnavailable
        ? !this.showSourceBrowser
        : false;
  }

  /*   parseToDOM(str: string) {
    var div = document.createElement('div');
    if (typeof str == 'string') div.innerHTML = str;
    return div.childNodes;
  } */

  async getFileSource(path: string) {
    const {
      pkgDetail: { name }
    } = this;

    if (!BigFileCache[path]) {
      BigFileCache[path] = await getPkgFileSource(name, path).then(
        (htmlText: string) => {
          return runkitCleanHTML(htmlText);
        }
      );
    }

    this.showSourceViewer = true;
    this.sourceHTML = BigFileCache[path];

    // 绑定复制代码按钮
    setTimeout(() => {
      const targetFileEl = document.querySelector(
        'article.post-content'
      ) as HTMLElement;
      targetFileEl
        .querySelector('.copy-button')!
        .addEventListener('click', () => {
          this.copyFileSource(targetFileEl);
        });
    }, 300);
  }

  // 复制文件代码
  copyFileSource(target: HTMLElement) {
    const el = target.querySelector('#src .code') as HTMLElement;
    utools.copyText(el ? el.innerText : '😢不能复制!');
  }

  beforeDestroy() {
    BigFileCache = {}; // 清空缓存
  }

  // loader-bar
  // node-npm-template mui
}
</script>

<style  lang="scss">
@import './Detail.scss';
@import './sourceviewer.scss';
@import './light.scss';

.runkit-btn {
  width: 100%;
  padding-top: 0.5rem;
  text-align: center;
  a {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    width: 100%;
    display: inline-block;
    text-decoration: none;
    background-image: linear-gradient(
      -180deg,
      hsla(0, 0%, 100%, 0.13),
      rgba(0, 184, 15, 0.1)
    );
    border: 1px solid rgba(75, 173, 58, 0.5);
    background-color: #fff;
    color: #444;
  }
  svg {
    height: 16px;
    width: 16px;
    padding-top: 4px;
    margin: 0 5px 0 0;
  }
}

// .source-viewer
.copy-button {
  // position: fixed;
  color: #dd6546;
  right: 6vw;
  top: 2vw;
  border: 1px #c5c5c5 solid;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  z-index: 9999;
  &:active {
    box-shadow: inset 2px 2px 4px #a0a0a0;
  }
}
</style>
