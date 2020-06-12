<template>
  <li>
    <div>
      <!-- <a
        href="https://npm.runkit.com/mocha/assets/growl/ok.png?t=1591545024237"
            >-->
      <a
        v-if="list.name"
        :title="list.type=== 'file' && list.name"
      >
        <span
          class="fa-label"
          :style="depthStyle(list.depth)"
          @click="subDirClick(fullPath, list.type)"
        >
          <i :class="`icon ${icon(list.name, list.type)} `"></i>{{list.name}}</span>
      </a>

      <!--  v-show="showSubLevel" 看你是否要记住打开项 -->
      <ul
        v-show="showSubLevel"
        class="fb-viewer"
      >
        <Fileslist
          v-for="(item, i) in list.children"
          :key="i"
          :list="item"
          :active-sub="true"
          :path="fullPath"
          @item-click="subDirClick"
        ></Fileslist>
      </ul>
    </div>
  </li>
</template>

<script lang="ts">
// test :https://runkit.com/api/npm/info/mocha?version=2.6.0
// https://npm.runkit.com/mocha/package.json?t=1591545024237
import { Component, Vue, Prop } from 'vue-property-decorator';
import { getFileIcon } from './helper';

interface Dir {
  name: string;
  type: 'file' | 'folder';
  depth: number;
  children: null | Dir[];
}
@Component({
  name: 'Fileslist'
})
export default class List extends Vue {
  @Prop() list!: Dir;

  @Prop({ type: Number, default: 0 }) depth!: number;
  @Prop({ type: Boolean, default: false }) activeSub!: boolean;
  @Prop({ type: String, default: '' }) path!: string;

  private currentItem!: any;
  private showSub = false;
  private static allPathArray: string[] = [];
  private fullPath = '';

  constructor() {
    super();
    const { name, type } = this.list;
    // 拼接完整路径
    this.fullPath = !name ? this.path : this.path + '/' + name;

    if (this.fullPath !== '' && type === 'file')
      List.allPathArray.push(this.fullPath);
    //  可以想办法 更换为 vscode icons
    // console.log('Fileslist dir', this.fullPath);
  }

  // === 点击显示子目录及文件 ,传递到外部===
  /** 因为递归，每级组件都会触发 */
  subDirClick(fullPath: string, itemType: string) {
    const { showSub } = this;
    // 只点击文件夹
    if (itemType === 'folder') {
      this.showSub = !showSub;
    } else {
      this.$emit('item-click', fullPath, itemType);
    }
  }

  // 点击，显示子文件
  get showSubLevel() {
    const { activeSub, showSub } = this;
    // console.log('showSubshowSub', showSub);
    if (activeSub && !showSub) {
      return false;
    } else {
      return true;
    }
  }

  depthStyle(depth: number) {
    return { paddingLeft: `${14 + 14 * depth}px` };
  }

  // 获取图标显示
  icon(name: string, type: string) {
    return `icon-${
      type === 'file'
        ? getFileIcon(name)
        : this.showSubLevel
        ? 'folder-open'
        : 'folder'
    }`;
  }

  mounted() {
    this.$emit('dom-mounted', List.allPathArray);
  }
}
</script>

<style scoped lang="scss">
@import './style.scss';
.icon {
  width: 1.2em;
  display: inline-block;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
