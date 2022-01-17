<template>
  <div>
    <div class="menu">
      <div>
        <button class="menu-button" @click="open">打开</button>
        <button class="menu-button" @click="goBack">关闭</button>
        <button class="menu-button" @click="extractClicked">提取</button>
        <button class="menu-button" @click="save">保存</button>
      </div>
      <button @click="reveal(asarPath)" class="filepath" :title="asarPath">
        『{{ title }}』👈
      </button>
    </div>
    <div class="content">
      <!-- 左侧文件结构区域 -->
      <div class="tree-view" :style="{ width: treeWidth + 'px' }">
        <FileBrowser search @get-path="onItemClicked" :directory-listing="tree" />
      </div>
      <!-- 右侧文件内容区 -->
      <div
        class="list-view"
        :style="{ width: `calc(100% - ${treeWidth}px)` }"
        @click="clearListFocus"
      >
        <!-- <FileList
            :tree="tree"
            v-model:dir="activeDir"
            @itemclick="onListItemClicked"
            @itemdoubleclick="onListItemDoubleClicked"
          /> -->
        <img v-show="showPic" :src="picSrc" alt="EFE" />
        <monaco-editor
          ref="editor"
          v-show="!showPic"
          v-model="monacoOptions.value"
          class="editor"
          :options="monacoOptions"
          :language="monacoOptions.language"
          @editor-did-mount="onEditorDidMount"
          url="https://lib.baomitu.com/monaco-editor/latest/min/"
        />
      </div>
      <div class="resize" :style="{ left: `${treeWidth - 4}px` }" @mousedown="onMouseDown"></div>
    </div>
    <div class="footer">
      <div>{{ activeDir }}</div>
      <div>
        <span>{{ asarDetailString }}</span>
      </div>
    </div>
    <ModalExtract
      v-if="extractModalShow"
      :cmax="modal.cmax"
      :cpos="modal.cpos"
      :tmax="modal.tmax"
      :tpos="modal.tpos"
      :text="modal.text"
    />
    <!-- <div>{{ asarPath }}</div>
    <div>{{ activeDir }}</div>
    <div>{{ activePath }}</div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { openFile, formatSize } from '../utils';
import { setAsarPath, getters, setTree } from '../store/store';
import FileBrowser from '../components/FileBrowser/index.vue';
import ModalExtract from '../components/ModalExtract.vue';
import MonacoEditor from 'vue-monaco-cdn';

const Asar = window.Asar;
const { basename, join, extname } = window.toRequire('path');
let monacoEditor: any = null;

export default defineComponent({
  components: {
    FileBrowser,
    ModalExtract,
    MonacoEditor,
  },
  data() {
    const data: {
      picSrc: string;
      treeWidth: number;
      showPic: boolean;
      activePath: string;
      activeDir: string;
      selectedItems: ListItem[];
      asar: typeof Asar | null;
      extractModalShow: boolean;
      modal: {
        text: string;
        tmax: number;
        tpos: number;
        cmax: number;
        cpos: number;
      };
      monacoOptions: any;
    } = {
      picSrc: '',
      treeWidth: 200,
      showPic: false,
      activePath: '/plugin.json',
      activeDir: '/',
      selectedItems: [],
      asar: null,
      extractModalShow: false,
      modal: {
        text: '',
        tmax: 100,
        tpos: 75,
        cmax: 100,
        cpos: 25,
      },
      monacoOptions: {
        value: '',
        language: 'javascript',
        fontSize: 13,
        hideCursorInOverviewRuler: true,
        overviewRulerBorder: false,
        renderLineHighlight: 'none',
        fontFamily:
          'Operator Mono Lig, Dank Mono, Microsoft YaHei Mono, Source_Code_Pro-YaHei Hybrid',
        lineHeight: 20,
        fontLigatures: true,
        detectIndentation: true,
        wordWrap: 'on',
        minimap: {
          enabled: false,
        },
        // contextmenu: false,
        autoIndent: true,
        // formatOnPaste: true,
        // formatOnType: true,
      },
    };
    return data;
  },
  computed: {
    ...getters,
    title(): string {
      return basename(this.asarPath || '');
    },
    asarDetailString(): string {
      let folders = 0;
      let files = 0;
      Asar.walk(this.tree, (n: AsarNode) => {
        if (n.files) {
          folders++;
        } else {
          files++;
        }
      });
      return `文件: ${files}, 文件夹: ${folders - 1}, 大小: ${
        formatSize(this.asar?.getFileSize() || 0) || '未知'
      }`;
    },
  },
  async created() {
    if (this.asarPath) {
      await this.open(this.asarPath);
    }
  },
  mounted() {
    utools.onPluginOut(
      async () =>
        new Promise((resolve) => {
          this.closeAsar(); // 移除缓存文件
          setTimeout(resolve, 300);
        })
    );
  },
  unmounted() {
    this.closeAsar();
  },
  methods: {
    onEditorDidMount(editor: any) {
      monacoEditor = editor;
      // console.log(this.)
      const { name, type } = this.tree[this.tree.length - 1];
      type === 'file' && this.$nextTick(() => this.onItemClicked('/' + name));
    },
    async open(asarpath: string) {
      let path = asarpath;
      if (typeof path !== 'string') {
        path = await openFile();
      }
      if (extname(path) === '.asar') {
        this.closeAsar();
        setAsarPath(path);
        this.asar = Asar.open(path);
        this.asar.extract('.', this.asar._tmp);
        this.readHeader();
      }
    },
    readHeader() {
      if (this.asar) {
        setTree(this.asar.getHeader(true));
      }
    },
    clearListFocus() {
      this.selectedItems.forEach((item) => {
        item.focused = false;
      });
      this.selectedItems = [];
    },
    getFileType(file: string) {
      let language = 'javascript';
      switch (extname(file)) {
        case '.html':
          language = 'html';
          break;
        case '.js':
          language = 'javascript';
          break;
        case '.css':
          language = 'css';
          break;
        case '.json':
          language = 'json';
          break;
        case '.md':
          language = 'markdown';
          break;
        default:
          language = 'plaintext';
          break;
      }
      return language;
    },
    async onItemClicked(filePath: string) {
      console.log('===monacoEditor===', this.tree, this.asar);
      if (!this.asar) return;
      this.activePath = filePath;
      if (/png|jp(e?)g|gif|svg/.test(extname(filePath))) {
        this.showPic = true;
        this.picSrc = 'file://' + this.asar.getSrc() + filePath;
        return;
      } else {
        this.showPic = false;
      }
      if (!monacoEditor) return;
      const code = window.readFileSync(this.asar.getTempPath(filePath), 'UTF-8');
      const language = this.getFileType(filePath);
      this.monacoOptions.language = language;
      monacoEditor.setValue(code);
      setTimeout(() => {
        language === 'json' && monacoEditor.getAction('editor.action.formatDocument').run();
      }, 200);
    },
    async save() {
      const dest = this.activePath;
      // TODO 删除 所有 utools.getPath('temp') + this.title 下所有 .asarer-temp 缓存文件
      const newTempPath = join(utools.getPath('temp'), `${dest}.asarer-temp`);
      //  this.reveal(this.asar._tmp);
      window.writeFileSync(newTempPath, monacoEditor.getValue(), 'UTF-8');
      // this.reveal(newTempPath);
      await this.asar.write(dest, newTempPath);
      window.rmSync(newTempPath);
    },
    //
    onListItemClicked(items: ListItem[]) {
      this.selectedItems = items;
      // todo
    },
    onListItemDoubleClicked(_e: MouseEvent, data: ListItem, path: string) {
      if (data.node?.files) {
        (this.$refs.tree as any).openFolder(path);
      }
    },
    goBack() {
      this.closeAsar();
      this.$router.back();
    },
    /**
     * 提取文件
     */
    async extractClicked() {
      const [savePath] =
        utools.showOpenDialog({
          properties: ['openDirectory', 'showHiddenFiles', 'createDirectory', 'promptToCreate'],
        }) || [];
      if (savePath) {
        await this.asar.extract(this.activePath, savePath);
        this.reveal(join(savePath, this.activePath));
      }
    },
    closeAsar() {
      if (this.asar) {
        this.asar.close();
        this.asar = null;
      }
    },
    reveal(path: string) {
      const filePath = path || this.asarPath;
      utools.copyText(filePath);
      utools.shellShowItemInFolder(filePath);
    },
  },
});
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.menu {
  width: 100%;
  background: linear-gradient(45deg, #0078d7, #5da9e4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
  button {
    outline: none;
    font-size: 16px;
    background: transparent;
    border: none;
    color: #fff;
  }
  .menu-button {
    width: 70px;
    line-height: 2.2rem;
    transition: background 0.2s;
    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
    &:active {
      background: rgba(0, 0, 0, 0.4);
    }
  }
  .filepath {
    &:active {
      background: rgba(49, 74, 174, 0.4);
    }
  }
}

.tree-view {
  background-color: #f3f3f3;
  height: 100%;
}
.list-view {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  background-color: rgba(186, 186, 186, 0.495);
}

.content {
  display: flex;
  justify-content: space-between;
  text-align: left;
  & > .resize {
    width: 4px;
    height: 100%;
    position: absolute;
    cursor: ew-resize;
    top: 0;
  }
  &.resize {
    cursor: ew-resize;
  }
}
.footer {
  height: 29px;
  line-height: 29px;
  background: #f0f0f0;
  border-top: 1px solid #ccc;
  padding: 0 5px 0 5px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
.editor {
  width: 100%;
  height: calc(100vh - 42px - 30px);
}
</style>
