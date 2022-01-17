<template>
  <div>
    <div v-if="needSearch" class="browser-top-container">
      <input v-model="searchText" type="text" placeholder="搜索文件..." @input="inputChange" />
    </div>
    <ul
      v-if="searchText"
      style="position: relative; max-height: 40vh; width: 100%; overflow: auto"
      class="fb-viewer"
      @scroll="onScroll"
    >
      <!-- 搜索列表 -->
      <li v-if="!searchedList.length" class="no-results">没有相关文件</li>

      <li
        @click="subDirClick(filepath)"
        v-for="({ filename, filepath }, i) in searchedList"
        v-else
        :key="filename + i"
      >
        <a style="padding: 12px 22px; display: block; line-height: 1.3em" :title="filename">
          <i
            :class="`icon
            icon-${fileIcon(filename)}`"
          ></i>
          <div style="overflow: hidden; text-overflow: ellipsis">
            <span class="filename">
              <span v-html="highlightify(filename)"></span>
              <br />
            </span>
            <span class="filepath">
              <span><span v-html="highlightify(filepath)"></span></span>
            </span>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getFileIcon } from './helper';

interface ResultList {
  filename: string;
  filepath: string;
}
export default defineComponent({
  name: 'SearchList',
  components: {},
  props: {
    needSearch: {
      type: Boolean,
      default: false,
    },
    filesList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchText: '',
      searchedList: [] as ResultList[],
      wrapperEl: this.$el,
    };
  },
  mounted() {
    this.wrapperEl = this.$el.querySelector('.browser-top-container') as HTMLElement;
  },
  methods: {
    subDirClick(filepath: string) {
      this.$emit('item-click', filepath, 'file');
    },
    // TODO: 高亮显示文件  类似 `r e a d` 也可以搜索 `README.md` 文件
    highlightify(fileStr: string) {
      const { searchText } = this;
      const reg = new RegExp(searchText.trim(), 'ig');
      return fileStr.replace(reg, (match) => {
        return `<span style="color: rgb(255, 147, 54);">${match}</span>`; // 返回会被用于替换的字符串
      });
    }, // 文件图标
    fileIcon(filename: string) {
      return getFileIcon(filename);
    },
    /**
     * 本着优化的目的去~却越看越渣渣~
     */
    searchFiles(list: any[], searchStr: string): ResultList[] {
      const tmpArr: ResultList[] = [];
      const text = searchStr.trim();

      for (const path of list) {
        const filename = path.replace(/\/.*\//, '').replace(/^\//, '');
        // const filepath = path.replace(/^\//, '');
        if (filename.toLowerCase().includes(text.toLowerCase())) {
          tmpArr.push({
            filename,
            filepath: path,
          });
        }
      }
      return tmpArr;
    },
    inputChange() {
      const { searchText, filesList, searchFiles, wrapperEl } = this;
      this.searchedList = searchFiles(filesList, searchText);
      this.$emit('show-result', !!searchText.length); // 显示文件列表吗？
      this.isScrolled(wrapperEl);
      // console.log('搜索到的文件数：', this.searchedList);
    },
    isScrolled({ scrollTop }: HTMLElement) {
      if (scrollTop > 0) {
        this.wrapperEl.classList.add('scroll');
      } else {
        this.wrapperEl.classList.remove('scroll');
      }
    },

    // 监听 scroll
    onScroll({ target }: Event) {
      this.isScrolled(target as HTMLElement);
    },
  },
});
</script>

<style lang="scss" scoped>
@import './style.scss';
.browser-top-container {
  position: relative;
  top: 0px;
  right: 0px;
  left: 0px;
  background: rgb(238, 238, 238);
  padding: 14px;
  z-index: 100;
  box-shadow: rgba(0, 0, 0, 0) 0pt 0pt 5pt;

  transition: box-shadow 0.1s ease 0s;
  &.scroll {
    box-shadow: rgba(0, 0, 0, 0.33) 0pt -5px 5px 5px; // 当内部向下滑动时~
  }
}
input[type='text'] {
  color: rgb(51, 51, 51);
  width: 100%;
  line-height: 1.8em;
  border-radius: 4px;
  padding: 0 5px;
  box-sizing: border-box;
  border: 0px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08), 0 2px 2px 0 rgba(0, 0, 0, 0.16);
  &:focus {
    box-shadow: 0 0 0 1px #7dc8ff, 0 0 0 3px rgba(125, 200, 255, 0.5),
      0 2px 2px 0 rgba(0, 0, 0, 0.16);
    outline: none;
  }
}
a {
  color: #212529;
}
.no-results {
  text-align: center;
  color: rgb(119, 119, 119);
  padding: 10pt;
}
.icon {
  font-size: 2.2em;
  float: left;
  margin-right: 0.22em;
}
.filename {
  font-size: 1em;
}
.filepath {
  font-size: 0.82em;
  color: rgb(140, 142, 140);
}
</style>
