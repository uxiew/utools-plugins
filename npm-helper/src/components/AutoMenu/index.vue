<template>
  <div
    v-if="showTOC"
    class="navi-toc"
  >
    <ul
      v-show="showNavi"
      :style="wrapStyle"
    >
      <div class="input-wrap">
        <input
          ref="searchInput"
          v-model="searchVal"
          type="text"
          placeholder="搜索标题"
        />
      </div>
      <div class="i-placeholder">
      </div>
      <li
        v-for="( {text,tagName,anchor},index ) in naviItems"
        v-show="text.toUpperCase().includes(searchVal.toUpperCase())"
        :key="index"
        :class="{[tagName]:true, active:activeLiIndex == index}"
      >
        <a
          :title="text"
          @click="gotoAnchor(anchor,index)"
        >{{ text }}</a>
        <!-- :href="'#'+anchor" -->
      </li>
    </ul>
    <span
      :class="showNavi? 'icons i-minus':'icons i-plus'"
      @click="collapse"
    ></span>
  </div>
</template>

<script lang="ts">
/*
 * blogMenu plugin 1.0   2017-09-01 by cary
 * 说明：自动根据标签（h1,h6）生成博客目录
 */
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

interface naviType {
  [prop: string]: string;
}
@Component({
  name: 'AutoMenu'
})
export default class AutoMenu extends Vue {
  @Prop({ type: String, default: 'h1,h2,h3,h4,h5,h6' }) levelTags!: string; // 针对这些标签做标记
  @Prop({ type: String, default: 'body' }) selector!: string; // 对特定区域做目录生成
  @Prop({ type: Object, default: 'body' }) wrapStyle!: object;

  private levelShow = true; // 搜索标题
  private showNavi = false; //  是否展开目录
  private searchVal: string = '';
  private activeLiIndex: number = 0; //当前被激活
  private showTOC = false; // 数据不被vue观察

  private naviItems!: naviType[]; // 数据不被vue观察
  private anchor!: string; // 跳转的 id
  private fromAnchor!: boolean; // 跳转的 id

  mounted() {
    const { levelTags, selector } = this;
    this.fromAnchor = false;
    this.naviItems = [];
    const container = document.querySelector(selector) as HTMLDivElement;
    const HTagEls = container.querySelectorAll(levelTags) as NodeListOf<
      HTMLHeadElement
    >;
    !container
      ? console.error('selector error!')
      : HTagEls.forEach((el, i) => {
          this.naviItems.push({
            tagName: el.tagName.toLowerCase(),
            anchor: el.id
              ? el.id
              : (el.setAttribute('id', String(i)), String(i)),
            text: (el as HTMLElement).innerText
          });
        });

    if (!this.naviItems.length) {
      this.showTOC = false;
      return;
    }
    this.showTOC = true;
    this.anchor = this.naviItems[0].anchor;

    let tempIndex = 0;
    const middleClientHeight = document.documentElement.clientHeight / 2; // 做一下小习惯
    document!.addEventListener('scroll', () => {
      if (!this.fromAnchor) {
        HTagEls.forEach((hEl, i) => {
          if (this.getOffsetTop(hEl) < middleClientHeight) {
            tempIndex = i;
            this.anchor = hEl.id;
          }
        });
        this.activeLiIndex = tempIndex;
      }
    });
  }

  // 滚动优化
  getOffsetTop(el: HTMLElement) {
    return el.getBoundingClientRect().top;
  }
  // 点击到目标
  gotoAnchor(anchor: string, index: number) {
    if (this.activeLiIndex !== index) {
      this.anchor = anchor;
      this.fromAnchor = true;
      this.activeLiIndex = index;
      document
        .getElementById(anchor)!
        .scrollIntoView({ behavior: 'auto', block: 'center' });
      setTimeout(() => {
        this.fromAnchor = false;
      }, 1000);
    }
  }

  // 目录滚动操作！
  @Watch('activeLiIndex')
  naviLi() {
    if (!this.showNavi) return;
    const naviEl = document.querySelector('.navi-toc ul') as HTMLUListElement;

    if (naviEl) {
      const offsetTop = (naviEl.childNodes[
        this.activeLiIndex + 1
      ] as HTMLLIElement).offsetTop;
      const height = naviEl.offsetHeight / 2;

      if (naviEl.scrollHeight > naviEl.offsetHeight && offsetTop > height) {
        naviEl.scrollTop = offsetTop - height;
      } else {
        naviEl.scrollTop = 0;
      }
    }
  }

  // 展开按钮
  collapse() {
    let {
      showNavi,
      $refs: { searchInput }
    } = this;
    this.showNavi = !showNavi;
    //然后调用 focus方法
    this.$nextTick(() => {
      (searchInput as HTMLElement).focus();
    });
  }
}
</script>

<style scoped lang="scss">
.navi-toc {
  position: fixed;
  bottom: 50px;
  right: 15px;
  z-index: 1;
  text-align: left;
  .input-wrap {
    input {
      border: none;
      outline: none;
      border-bottom: 1px solid #64c699;
      margin-bottom: 10px !important;
      font-size: 16px;
      width: 100%;
      box-shadow: none;
    }
    width: 312px;
    position: fixed;
    padding-top: 10px;
    /* height: 100px; */
    background: #fff;
  }
  .i-placeholder {
    height: 50px;
  }
  ul {
    line-height: 2;
    overflow-y: auto;
    background-color: #ffffffad;
    box-shadow: 0 0 16px #9c9c9c;
    margin: 0 0 5px 0;
    width: 360px;
    height: 460px; //容器style
    padding: 20px; //内部间距
    padding-top: 0; //内部间距
  }

  a {
    color: #42b983;
    text-decoration: none;
    font-weight: normal;
    user-select: none;
  }
  li {
    list-style: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &.h1 a {
      font-weight: bold;
    }
    &.h2 {
      padding-left: 15px;
    }

    &.h3 {
      padding-left: 30px;
    }
    &.h4 {
      padding-left: 45px;
    }
    &.h5 {
      padding-left: 60px;
    }
    /*  &>a {
    color: #399c9c;
} */
    &.active > a {
      color: #ff5370;
    }
  }

  .icons {
    position: absolute;
    right: 0;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    cursor: pointer;
  }

  .i-plus {
    border: 4px solid #91ba61;
    background: #91ba61;
  }

  .i-plus:before,
  .i-plus:after {
    content: '';
    display: inline-block;
    width: 4px;
    height: 18px;
    background: #fff;
    border-radius: 1px;
    position: absolute;
    top: 0px;
    left: 7px;
  }

  .i-plus:after {
    transform: rotate(90deg);
  }

  .i-minus {
    border: 4px solid #ff5370;
    background: #ff5370;
  }

  .i-minus:before {
    content: '';
    display: inline-block;
    width: 18px;
    height: 4px;
    background: #fff;
    border-radius: 1px;
    position: absolute;
    top: 7px;
    left: 0px;
  }
}
</style>