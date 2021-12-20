<template>
  <div>
    <div class="menu">
      <div>
        <button class="menu-button" @click="open">打开</button>
        <button class="menu-button" @click="goBack">关闭</button>
        <button class="menu-button" @click="extractClicked">提取</button>
      </div>
      <button @click="reveal" class="filepath" :title="asarPath">『{{ title }}』👈</button>
    </div>
    <div class="content" :class="{ resize: point }" @mousemove="onMouseMove" @mouseup="onMouseUp">
      <!-- 左侧文件结构区域 -->
      <div class="tree-view" :style="{ width: treeWidth + 'px' }">
        <Tree ref="tree" v-model="activeDir" :tree="tree" :title="title" />
      </div>
      <!-- 右侧文件内容区 -->
      <div
        class="list-view"
        :style="{ width: `calc(100% - ${treeWidth}px)` }"
        @click="clearListFocus"
      >
        <FileList
          :tree="tree"
          v-model:dir="activeDir"
          @itemclick="onListItemClicked"
          @dragstart="onDragStart"
          @itemdoubleclick="onListItemDoubleClicked"
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
    <!-- <div>{{asarPath}}</div>
    <div>{{activeDir}}</div>
    <div>{{activePath}}</div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { openFile, deepCopy, formatSize } from '../utils';
import { setAsarPath, getters, setTree } from '../store/store';
import Tree from '../components/Tree.vue';
import FileList from '../components/list/FileList.vue';
import ModalExtract from '../components/ModalExtract.vue';

const Asar = window.Asar;
const { basename, join } = window.toRequire('path');

export default defineComponent({
  components: {
    Tree,
    FileList,
    ModalExtract,
  },
  data() {
    const data: {
      point: null | [number, number];
      treeWidth: number;
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
    } = {
      point: null,
      treeWidth: 200,
      activeDir: '',
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
    };
    return data;
  },
  computed: {
    ...getters,
    title(): string {
      return basename(this.asarPath || '');
    },
    asarDetailString(): string {
      if (!this.asar) return '';
      let folders = 0;
      let files = 0;
      Asar.walk(this.tree as typeof Asar.AsarNodeDirectory, (n: AsarNode) => {
        if (n.files) {
          folders++;
        } else {
          files++;
        }
      });
      return `文件: ${files}, 文件夹: ${folders - 1}, 大小: ${
        formatSize(this.asar.getFileSize() || 0) || '未知'
      }`;
    },
  },
  mounted() {
    console.log(window.toRequire(join(this.asarPath, 'plugin.json')));
    // this.$nextTick(() => {
    if (this.asarPath) {
      this.closeAsar();
      this.asar = Asar.open(this.asarPath);
      this.readHeader();
    }
    // });
  },
  beforeMount() {
    this.closeAsar();
  },
  methods: {
    onMouseMove(e: MouseEvent) {
      if (this.point) {
        const x = e.pageX;
        let target: any = e.target;
        while (target && !target.classList.contains('content')) {
          target = target.parentNode;
        }
        if (!target) return;
        const targetLeft = target.offsetLeft as number;
        const left = this.point[0] - targetLeft;
        const newWidth = left + x - this.point[0];
        this.treeWidth = newWidth < 100 ? 100 : newWidth > 250 ? 250 : newWidth;
      }
    },
    onMouseUp() {
      if (this.point) {
        this.point = null;
      }
    },
    onMouseDown(e: MouseEvent) {
      if (!this.point) {
        this.point = [e.pageX, e.pageY];
      }
    },
    onItemClicked(_item: TreeItem) {
      // console.log(JSON.stringify(item, (key, value) => {
      //   if (key[0] === '_') {
      //     return undefined
      //   }
      //   return value
      // }, 2))
    },
    async open() {
      const path = await openFile();
      if (!path) return;
      if (window.toRequire('path').extname(path) === '.asar') {
        this.closeAsar();
        setAsarPath(path);
        this.asar = Asar.open(path);
        this.readHeader();
      } else {
        alert('Not an asar file.');
      }
    },
    readHeader() {
      if (this.asar) {
        setTree(this.asar.getHeader(true));
      }
      this.$nextTick(() => {
        (this.$refs.tree as any).openFolder('/');
        this.activeDir = '/';
      });
    },
    clearListFocus() {
      this.selectedItems.forEach((item) => {
        item.focused = false;
      });
      this.selectedItems = [];
    },
    onDragStart() {
      // todo
    },
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
      if (!this.selectedItems.length || !this.asar) return;
      const [savePath] =
        utools.showOpenDialog({
          properties: ['openDirectory', 'showHiddenFiles', 'createDirectory', 'promptToCreate'],
        }) || [];
      if (savePath) {
        for (let item of this.selectedItems) {
          await this.asar.extract(item.path, savePath);
        }
        this.reveal(join(savePath, basename(this.selectedItems[0].path)));
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
  box-sizing: border-box;
  padding: 2px 10px;
}
.list-view {
  box-sizing: border-box;
}
.content {
  display: flex;
  justify-content: space-between;
  height: calc(100% - 70px);
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
</style>
