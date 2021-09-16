<template>
  <section id="post_top" class="post-single">
    <FileBrowser
      v-if="showSourceBrowser"
      :search="true"
      :directory-listing="pkgSourceDirList"
      @get-path="getFileSource($event)"
    ></FileBrowser>
    <van-skeleton title :row="10" :loading="skeLoading">
      <van-empty
        v-if="pkgDetail.error"
        image="error"
        :description="pkgDetail.error"
      />
      <div v-else class="article post-content" @click.prevent="closeAllPop">
        <div class="post-content-top">
          <!-- 头部 -->
          <header class="post-title">
            <div class="header-text">
              <van-icon v-if="isCollected" name="star" size="12" color="#f00" />
              {{ titleDate }}
            </div>
            <van-popover
              ref="actionPopover"
              v-model="showPopAction"
              trigger="click"
              :actions="actions"
              @select="onPopSelect"
            >
              <template #reference>
                <h1 class="header header__primary" @dblclick="showPkgFBrowser">
                  {{ title }}
                </h1>
              </template>
            </van-popover>
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
              <a class="post-copy-link" @click.prevent="copyInstall()" />
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
                <span>monthly downloads</span>
                <div class="post-table-content">
                  {{ pkgDetail.downloadsLast30Days | convertToThousands }}
                </div>
              </div>
              <div class="post-table-cell">
                <span>License</span>
                <div class="post-table-content">
                  {{ (pkgDetail.license || '-') | truncate }}
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
            position="bottom"
            @closed="closeSourceViewer"
          >
            <div class="actions">
              <button class="copy-button">复制</button>
              <button class="copy-button">运行代码</button>
            </div>
            <codemirror ref="cmEditor" :value="code" :options="cmOptions" />
          </van-popup>

          <!-- 底部关键字和相关库 -->
          <Tabs
            :pkgname="pkgDetail.name"
            :keywords="pkgDetail.keywords"
            :dependencies="pkgDetail.dependencies"
            :versions="pkgDetail.versions"
            :get-info="fetchPkgOtherInfo"
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
  getPkgDetail,
  getSourceStructure,
  getPkgFileSource,
  getGhFile,
  getNpmioDetail
} from '../../utils/API';
import { timeAgo, toThousands } from '../../utils/util';
//@ts-ignore
import { codemirror } from 'vue-codemirror';
import 'codemirror/theme/mdn-like.css'; // 这里引入的是主题样式，根据设置的theme的主题引入，一定要引入！！
require('codemirror/mode/javascript/javascript'); // 这里引入模式的js，根据设置的mode引入，一定要引入！！
require('codemirror/mode/python/python.js');
require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/fold/brace-fold.js');
require('codemirror/addon/fold/xml-fold.js');
require('codemirror/addon/fold/indent-fold.js');
require('codemirror/addon/fold/markdown-fold.js');
require('codemirror/addon/fold/comment-fold.js');

import jsDownload from 'js-downloadfiles';
import { Toast } from 'vant';
import marked from 'marked';
import prism from 'prismjs';
import FileBrowser from '../../components/FileBrowser/index.vue';
import AutoMenu from '../../components/AutoMenu/index.vue';
import Tabs from './Tabs.vue';

// @ts-ignore
import Gitee from 'gitee-client';

interface PkgDataType {
  name: string;
  version: string;
  description?: string;
  license?: string;
  modified?: string;
  readme?: string;
  downloadsLast30Days?: number;
  keywords?: string[];
  dependencies?: string[];
  repository?: { type: string; url: string };
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

let canCloseSourceViewer = true;

let BigFileCache: {
  [prop: string]: string;
} = {};
/* eslint-disable no-undef */
@Component({
  name: 'Detail',
  components: { codemirror, FileBrowser, AutoMenu, Tabs },
  filters: {
    convertToThousands: (val: string | number = '-') => {
      return toThousands(val);
    },
    truncate: (text: string) => {
      const maxwidth = 20;
      if (text.length > maxwidth) return text.substring(0, maxwidth) + '...';
      return text;
    }
  }
})
export default class Detail extends Vue {
  private skeLoading: boolean = true;
  private pkgDetail: PkgDataType = {
    name: '',
    version: '',
    repository: { type: 'git', url: '' },
    keywords: [],
    dependencies: []
  };
  private isCollected = false;
  private showPopAction = false;
  private actions = [
    { text: '收藏✨', key: 'collect', icon: 'star-o' },
    { text: '下载', key: 'download', icon: 'down' },
    { text: '运行', key: 'run', icon: 'edit' }
  ];

  private code = '';
  private cmOptions = {
    value: '',
    mode: 'text/javascript',
    theme: 'mdn-like',
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
    line: true,
    readOnly: true
  };

  private pkgSourceDirList!: [];

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

  // 标题动作选项
  async onPopSelect(action: any) {
    console.log(action, action.key);
    switch (action.key) {
      case 'collect':
        this.collect();
        break;
      case 'download':
        // https://r.cnpmjs.org/@techiediaries/ngx-textarea-autosize/download/@techiediaries/ngx-textarea-autosize-1.2.0.tgz
        // download(
        //   `https://r.cnpmjs.org/@techiediaries/ngx-textarea-autosize/download/@techiediaries/ngx-textarea-autosize-1.2.0.tgz`,
        //   utools.getPath('downloads')
        // );
        {
          /*  const pkgInfo = await pacote.tarball(
            getNpmTarballUrl(this.pkgDetail.name, this.pkgDetail.version, {
              registry: `https://registry.npm.taobao.org/`
            })
          ); */
          Toast.loading({
            message: '下载中...'
          });
          const { name, version } = this.pkgDetail;
          const tarball = `https://registry.nlark.com/${name}/download/${name}-${version}.tgz`;
          jsDownload.handleDownloadOne({
            id: this.pkgDetail.name,
            url: tarball,
            name: `${this.pkgDetail.name}.tgz`,
            progressFunBack: (res: {
              progress: number;
              id: string;
              name: string;
            }) => {
              if (res.progress === 100) Toast.clear();
            }
          });
        }
        break;
      case 'run':
        break;
    }
  }

  // 监听用户输入
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
    const author = this.repoUrl.match(/com\/(.+?)\//);
    return ` Published ${relTime}${author ? ' by ' + author[1] : ''}`; //1.2.6 • Published 4 years ago
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
      url = url.replace(/(git.*github|\.git)/g, (match, p1, index) => {
        return index === 0 ? 'https://github' : '';
      });
    }
    return url;
  }

  // 添加到收藏
  async collect() {
    const GITEE_TOKEN = process.env.VUE_APP_GITEE_TOKEN;
    const GIST_ID = process.env.VUE_APP_GIST_ID;
    const gee = new Gitee(GITEE_TOKEN);

    // 新增新的npm包：
    const { name, description, version } = this.pkgDetail;
    window.collection.tags.push('framework');
    window.collection.npmList.push({
      name,
      description,
      version,
      type: 'js',
      tag: 'framework'
    });
    const files = {
      'npm-helper': { content: JSON.stringify(window.collection) }
    };

    console.log(JSON.stringify(window.collection), files);
    let { data } = await gee
      .patch(`/v5/gists/${GIST_ID}`, {
        files,
        description: 'npm-helper 插件数据',
        public: 'false'
      })
      .catch(console.error);
    console.log(data);
  }

  // 复制
  copyInstall() {
    utools.copyText(this.installDesc)
      ? this.$toast('复制成功', { position: 'top' })
      : this.$toast('复制失败', { position: 'top' });
  }
  runInRunKit() {
    utools.shellOpenExternal(`https://runkit.com/npm/${this.pkgDetail.name}`);
  }

  // 关闭源文件显示popup
  closeSourceViewer() {
    canCloseSourceViewer = true;
  }

  // 关闭源文件列表
  closeAllPop(e: any) {
    const popWrapperNode = e.target.parentNode;
    if (popWrapperNode.className !== 'van-popover__wrapper')
      // @ts-ignore
      this.$refs.actionPopover.$refs.popover.close();
    // 关闭源代码栏
    if (canCloseSourceViewer) this.showSourceBrowser = false;
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
          !href.startsWith('http') &&
            href.toLocaleLowerCase().endsWith('.md') &&
            utools.shellOpenExternal(
              `${this.repoUrl}/blob/master/${href.replace(/file.*\//, '')}`
            );
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
    BigFileCache = {};
  }

  async fetchPkgInfo(params: string) {
    this.resetDetail();
    this.pkgDetail = await getPkgDetail(params);
    this.skeLoading = false;
    this.pkgDetail.readme = marked.parse(
      this.pkgDetail.readme ||
        (await getGhFile(this.repoUrl, this.pkgDetail.version)) ||
        '❌: 没有找到 README 文件！😢'
    );
    // -
    const elTarget = document.querySelector('#post_top');
    elTarget && elTarget.scrollIntoView(true);
    return this.pkgDetail;
  }
  async fetchPkgOtherInfo(params: string) {
    this.resetDetail();
    this.pkgDetail = await getNpmioDetail(params as string);
    this.skeLoading = false;
    this.pkgDetail.readme = marked.parse(
      this.pkgDetail.readme ||
        (await getGhFile(this.repoUrl, this.pkgDetail.version)) ||
        '❌: 没有找到 README 文件！😢'
    );
    // -
    const elTarget = document.querySelector('#post_top');
    elTarget && elTarget.scrollIntoView(true);
  }

  async mounted() {
    utools.setExpendHeight(700);
    const pkg = await this.fetchPkgInfo(
      this.queryPkgName || this.pkgDetail.name
    );
    const dd = utools.db.put({
      _id: `searched/${pkg.name}-${pkg.version}`,
      data: {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description
      }
    });
    console.log(dd);
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
      const { directoryListing = [], unavailable } = await getSourceStructure(
        name,
        version
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
    const { pkgDetail } = this;

    if (!BigFileCache[path]) {
      Toast.loading();
      BigFileCache[path] = await getPkgFileSource(pkgDetail, path);
    }

    this.code = BigFileCache[path];
    this.showSourceViewer = true;
    // tag
    canCloseSourceViewer = false;
    Toast.clear();

    // 绑定 按钮操作
    this.$nextTick(() => {
      const targetFileEl = document.querySelector(
        'article.post-content'
      ) as HTMLElement;
      targetFileEl
        .querySelector('.copy-button')!
        .addEventListener('click', () => {
          this.copyFileSource(this.code);
        });
    });
  }

  // 复制文件代码
  copyFileSource(source: string) {
    utools.copyText(typeof source === 'string' ? source : '😢无法复制!');
  }

  beforeDestroy() {
    BigFileCache = {}; // 清空缓存
  }

  // loader-bar
  // node-npm-template mui
}
</script>

<style lang="scss">
@import './Detail.scss';
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

// CodeMirror
.CodeMirror {
  font-family: 'Dank Mono', Consolas, monospace;
  height: 80vh;
  font-size: 13px;
  line-height: 150%;
}

// .source-viewer
.actions {
  padding: 6px;
  border-bottom: 1px #578dbf solid;
  .copy-button {
    margin-right: 10px;
    color: #7b6565;
    right: 6vw;
    top: 2vw;
    border: 1px #dedede solid;
    padding: 8px 10px;
    border-radius: 6px;
    cursor: pointer;
    z-index: 9999;
    &:active {
      box-shadow: inset 2px 2px 4px #a0a0a0;
    }
  }
}
</style>
