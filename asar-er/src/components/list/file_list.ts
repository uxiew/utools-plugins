import { defineComponent, PropType } from 'vue';
import FileListItem from './FileListItem.vue';
import { formatSize } from '@/utils';

const { basename, dirname, join, sep } = window.toRequire('path');

export default defineComponent({
  components: {
    FileListItem,
  },
  props: {
    tree: {
      type: Object as PropType<AsarNode>,
      default: () => ({ files: {} }),
    },
    dir: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Array as PropType<ListItem[]>,
      default: () => [],
    },
  },
  computed: {
    isFolder(item: ListItem) {
      return (item: ListItem) => !item.node || item.node.files;
    },
  },
  watch: {
    tree: {
      immediate: true,
      handler(val) {
        this.computeList(val, this.dir);
      },
    },
    dir(val) {
      this.computeList(this.tree, val);
    },
  },
  data() {
    const data: {
      point: null | [number, number];
      nameWidth: number;
      cdDotDotFocused: boolean;
      list: ListItem[];
      controlDown: boolean;
      shiftDown: boolean;
      lastClickedItemIndex: number;
    } = {
      nameWidth: 300,
      point: null,
      cdDotDotFocused: false,
      list: [],
      controlDown: false,
      shiftDown: false,
      lastClickedItemIndex: -1,
    };
    return data;
  },
  mounted() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
  },
  methods: {
    onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Control') {
        this.controlDown = true;
      } else if (e.key === 'Shift') {
        this.shiftDown = true;
      }
    },
    onKeyUp(e: KeyboardEvent) {
      if (e.key === 'Control') {
        this.controlDown = false;
      } else if (e.key === 'Shift') {
        this.shiftDown = false;
      }
    },
    computeList(tree: AsarNode, dir: string) {
      const node = getNode(tree, dir);
      if (!node || !node.files) {
        this.list = [];
        return;
      }
      const files = Object.keys(node.files);
      const res: ListItem[] = [];
      if (dir && dir !== '/') {
        res.push({
          node: node,
          path: basename(dir),
          name: '..',
          focused: false,
        });
      }
      const folderItem: ListItem[] = [];
      const fileItem: ListItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const path = join(dir, files[i]);
        const nodeItem = {
          node: node.files[files[i]],
          path: path,
          name: basename(path),
          focused: false,
        };
        if (nodeItem.node.files) {
          folderItem.push(nodeItem);
        } else {
          fileItem.push(nodeItem);
        }
      }
      this.list = [...res, ...folderItem, ...fileItem];
    },
    onMouseMove(e: MouseEvent) {
      if (this.point) {
        const x: number = e.pageX;
        let target: any = e.target;
        while (target && !target.classList.contains('file-list')) {
          target = target.parentNode;
        }
        if (!target) return;
        const targetLeft = target.offsetLeft as number;
        const left: number = this.point[0] - targetLeft;
        const newWidth = left + x - this.point[0];
        this.nameWidth = newWidth < 100 ? 100 : newWidth;
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
    onItemDoubleClicked(e: MouseEvent, data: ListItem) {
      let path: string;
      if (data.name === '..') {
        path = dirname(this.dir);
        this.$emit('update:dir', path);
      } else if (data.node?.files) {
        path = data.path;
        this.$emit('update:dir', path);
      } else {
        path = data.path;
      }
      this.$emit('itemdoubleclick', e, data, path);
    },
    /**
     * @description 点击内容条目
     */
    onItemClicked(e: MouseEvent, item: ListItem) {
      const currentSelectItems = [];

      if (this.shiftDown) {
        let index = -1;
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i] === item) {
            index = i;
          }
        }

        if (index !== this.lastClickedItemIndex && this.lastClickedItemIndex !== -1) {
          const start = index < this.lastClickedItemIndex ? index : this.lastClickedItemIndex;
          const end = index < this.lastClickedItemIndex ? this.lastClickedItemIndex : index;

          for (let i = 0; i < this.list.length; i++) {
            if (i <= end && i >= start) {
              this.list[i].focused = true;
              currentSelectItems.push(this.list[i]);
            } else this.list[i].focused = false;
          }
        } else {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i] === item) {
              this.list[i].focused = true;
              currentSelectItems.push(this.list[i]);
              this.lastClickedItemIndex = i;
            }
          }
        }
      } else if (this.controlDown) {
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i] === item) {
            this.list[i].focused = !this.list[i].focused;
            this.list[i].focused
              ? currentSelectItems.push(this.list[i])
              : currentSelectItems.splice(i, 1);
            this.lastClickedItemIndex = i;
          }
        }
      } else {
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i] === item) {
            this.list[i].focused = true;
            currentSelectItems.push(this.list[i]);
            this.lastClickedItemIndex = i;
          } else {
            this.list[i].focused = false;
          }
        }
      }
      this.$emit('update:modelValue', currentSelectItems);
      this.$emit('itemclick', currentSelectItems);
    },
    onDragStart(e: DragEvent) {
      this.$emit('dragstart', e);
    },
    basename(p: string): string {
      return basename(p);
    },
    formatSize(size: number) {
      return formatSize(size);
    },
  },
});

function getNode(node: AsarNode, ...path: string[]): AsarNode | null {
  if (!path.length) return null;
  let p = join(...path);

  if (p[0] === '/' || p[0] === '\\') p = p.substring(1);
  if (p === '' || p === '.') return node || null;

  const paths = p.split(sep);
  let pointer = node.files;

  for (let i = 0; i < paths.length - 1; i++) {
    if (pointer === undefined) return null;
    if (pointer[paths[i]] !== undefined) {
      pointer = pointer[paths[i]].files;
    }
  }

  if (!pointer || pointer[paths[paths.length - 1]] === undefined) return null;
  return pointer[paths[paths.length - 1]];
}
