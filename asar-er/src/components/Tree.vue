<template>
  <div class="tree">
    <div
      v-for="item in renderList"
      :key="item.key"
      @click="onItemClicked(item)"
      class="tree-item"
      :class="{
        active: item.key === modelValue,
        root: item.indent === 0,
        open: item.data._open,
        doc: isFile(item.data),
      }"
      :style="{ paddingLeft: item.indent ? item.indent + 'px' : void 0 }"
    >
      {{ item.title === '/' ? title : item.title }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

function resolveArray(arr: any[]): any[] {
  let res: any[] = [];
  for (let ar of arr) {
    if (Array.isArray(ar)) {
      res = [...res, ...resolveArray(ar)];
    } else {
      res.push(ar);
    }
  }
  return res;
}
const { join } = window.toRequire('path');

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    tree: {
      type: Object as PropType<AsarNode>,
      default: () => ({ files: {} }),
    },
    hideFile: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      nameWidth: 300,
      copiedValue: JSON.parse(JSON.stringify(this.tree)),
    };
  },
  computed: {
    isFile(data: any) {
      return (data: any) => !data.files;
    },
    renderList(): TreeItem[] {
      const items = this.renderNode('/', this.copiedValue, 0);
      return items;
    },
  },
  watch: {
    tree: {
      immediate: true,
      handler(val) {
        this.copiedValue = JSON.parse(JSON.stringify(val));
        console.log(this.renderNodea(this.copiedValue, 'asddas'));
        /**
         * {
         *  files:
              134.js: {size: 5794, offset: '0', integrity: {…}}
              183.js: {size: 28478, offset: '5794', integrity: {…}}
              717.js: {size: 4959, offset: '34272', integrity: {…}}
              autojs: {
                    files: {darwin_folder_open_to_iterm: {…}, github_clone: {…}, img_imgchr: {…}, ...}
            }
          }
         */
      },
    },
  },
  methods: {
    renderNodea(data: any, name = 'ad') {
      const tempArr: any[] = [];
      const nodeFiles = data.files;

      Object.keys(nodeFiles).forEach((fname) => {
        const data = nodeFiles[fname];
        if (data.files) {
          const files = this.renderNodea(data, fname);
          tempArr.push({
            name: fname,
            type: 'directory',
            files,
          });
        } else {
          tempArr.push({
            name: fname,
            type: 'file',
            hash: data.offset,
            size: data.size,
          });
        }
      });

      return tempArr;
    },
    /**
     * 渲染结构
     * data: {files: {…}, _open: true}
     * indent: 0
     * key: "/"
     * title: "/"
     */
    renderNode(title: string, asarNode: AsarNode, indent: number, base = '/'): TreeItem[] {
      const node: AsarNode = asarNode;
      const curPath: string = join(base, title);
      let items: TreeItem[] = [];
      let folderArr: TreeItem[] = [];
      let subfiles = node.files;
      // 文件夹
      if (subfiles) {
        folderArr.push({ title: title, data: node, indent: indent, key: curPath });
        if (node._open) {
          items = [
            ...items,
            ...resolveArray(
              Object.keys(subfiles).map((item) =>
                this.renderNode(item, subfiles![item], indent + 8, curPath)
              )
            ),
          ];
        }
      } else {
        items.push({ title: title, data: node, indent: indent, key: curPath });
      }
      items = [...folderArr, ...items];
      return items;
    },
    openFolder(dir: string): void {
      for (let item of this.renderList) {
        if (dir.indexOf(item.key) !== -1 && item.data.files) {
          item.data._open = true;
          if (dir === item.key) {
            return;
          }
        }
      }
    },
    onItemClicked(item: TreeItem): void {
      if (item.data.files) item.data._open = !item.data._open;
      console.log(item);
      this.$emit('update:modelValue', item.key);
      this.$emit('itemclick', item);
    },
  },
});
</script>

<style lang="scss">
.tree-item {
  font-size: 14px;
  height: 22px;
  line-height: 22px;
  color: #616161;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  &:hover {
    background: #e8e8e8;
  }
  &::before {
    display: inline-block;
    content: '';
    height: 16px;
    width: 16px;
    vertical-align: text-bottom;
    margin-right: 5px;
    background-image: url('~@/assets/images/Folder_16x.svg');
  }
  &.doc {
    &::before {
      background-image: url('~@/assets/images/Document_16x.svg');
    }
  }
  &.open {
    &::before {
      background-image: url('~@/assets/images/FolderOpen_16x.svg');
    }
  }
  &.root {
    &::before {
      background-image: url('~@/assets/images/RootFolder_16x.svg');
    }
    &.open {
      &::before {
        background-image: url('~@/assets/images/RootFolderOpen_16x.svg');
      }
    }
  }
}
.tree-item.active,
.tree-item.active:hover {
  background: #126ce1;
  color: #fff;
}
</style>
