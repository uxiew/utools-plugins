<template>
  <div id="app">
    <!--     <FileBrowser
      :search="false"
      :directory-listing="dir"
    /> -->
    <!-- <router-link to="/HelloWorld">Go to HelloWorld</router-link> -->
    <keep-alive :include="cashViews">
      <router-view />
    </keep-alive>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-undef */
import { Component, Vue } from 'vue-property-decorator';
import { translateYD } from './utils/API';

@Component({
  name: 'App'
})
export default class App extends Vue {
  private cashViews!: string[]; // 待优化，点击刷新

  created() {
    this.cashViews = ['List', 'Detail']; // 缓存视图

    // 右键单击手册，退出手册; 中键发送文本
    document.addEventListener('mousedown', (e: MouseEvent) => {
      if (2 == e.button) {
        // 右键
      } else if (0 == e.button) {
        // 左键
        this.$notify.clear();
      }
    });

    // 按键监听
    // idea 参考 https://hub.fastgit.org/fofolee/uTools-Manuals/blob/4c264bafc537d7a5971b14345c0f58dd097cc1c7/src/assets/index.js#L149
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      const {
        $router,
        $children: Comps,
        $route: { name }
      } = this;

      // console.log(e.code);
      const selectText = document.getSelection()!.toString();
      switch (e.code) {
        case 'KeyH':
          // TAB 键切换视图
          if (e.ctrlKey || e.metaKey) {
            utools.setSubInputValue('keywords:');
            this.$nextTick(() => utools.setSubInputValue(''));
          }
          break;
        // 查看包源码
        case 'KeyS':{
          const compsLast = Comps[Comps.length - 1];
            // @ts-ignore
          if (name === 'Detail' && !compsLast.showSourceBrowser) {
            // @ts-ignore
            compsLast.showPkgFBrowser && compsLast.showPkgFBrowser();
          }
          break;
        }
        // 划词翻译
        case 'KeyT':
          if (selectText) {
            translateYD(selectText)
              .then(transText => {
                transText &&
                  this.$notify({
                    message: transText,
                    color: '#000',
                    background: '#f5f5f9',
                    duration: 0
                  });
              })
              .catch(err => console.error(err));
          }
          break;
        case 'Tab':
          // TAB 键切换视图
          $router.push({
            name: name === 'Detail' ? 'List' : 'Detail',
            params: { tabKey: true }
          } as any);
          break;

        case 'Enter':
          // enter键
          if (name === 'List') {
            const pkgNameEl = (e.target as HTMLElement).querySelector(
              '.selected .pkg-name'
            );
            // 回车执行查询
            pkgNameEl &&
              this.$router.push({
                name: 'Detail',
                params: { name: pkgNameEl.innerHTML }
              });
          } else {
            utools.findInPage(this.$store.state.searchText);
            selectText &&
              $router.push({
                name: 'List',
                params: { enterKey: true, selectText }
              } as any);
          }
          break;
        case 'F3':
          // F3 键
          if (name === 'Detail') {
            utools.findInPage(this.$store.state.searchText);
          }
          break;
        // 上
        case 'ArrowUp':
          if (
            name === 'List' &&
            (e.target as HTMLElement)!.querySelector('.selected')
          ) {
            const selectedTarget = (e.target as HTMLElement)!.querySelector(
              '.selected'
            );

            if (selectedTarget && selectedTarget.previousElementSibling) {
              selectedTarget.previousElementSibling!.classList.add('selected');
              selectedTarget.classList.remove('selected');

              if (
                (selectedTarget.previousElementSibling as HTMLElement)
                  .offsetTop >
                document.documentElement.clientHeight / 2
              ) {
                document.documentElement.scrollTop =
                  (selectedTarget.previousElementSibling as HTMLElement)
                    .offsetTop -
                  document.documentElement.clientHeight / 2;
              }
            }
          }
          break;
        // 下
        case 'ArrowDown':
          if (name === 'List') {
            const selectedTarget = (e.target as HTMLElement)!.querySelector(
              '.selected'
            );
            if (selectedTarget && selectedTarget.nextElementSibling) {
              selectedTarget.nextElementSibling!.classList.add('selected');
              selectedTarget.classList.remove('selected');

              if (
                (selectedTarget.nextElementSibling as HTMLElement).offsetTop >
                document.documentElement.clientHeight / 2
              ) {
                document.documentElement.scrollTop =
                  (selectedTarget.nextElementSibling as HTMLElement).offsetTop -
                  document.documentElement.clientHeight / 2;
              }
            }
          }
          break;
        default:
          break;
      }
    });
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: Roboto Mono;
  font-style: normal;
  font-weight: 400;
  font-display: fallback;
  src: local('Roboto Mono'), local('RobotoMono-Regular'),
    url(assets/roboto-regular-08d04171598a673998ed16e97a3bcf7a.woff2)
      format('woff2');
  unicode-range: 'U+00??', U+0131, U+0152-0153, U+02bb-02bc, U+02c6, U+02da,
    U+02dc, U+2000-206f, U+2074, U+20ac, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+feff, U+fffd;
}
@font-face {
  font-family: Roboto Mono;
  font-style: normal;
  font-weight: 700;
  font-display: fallback;
  src: local('Roboto Mono Bold'), local('RobotoMono-Bold'),
    url(assets/roboto-bold-0a7069a8ff0fe166643999654fe06cff.woff2)
      format('woff2');
  unicode-range: 'U+00??', U+0131, U+0152-0153, U+02bb-02bc, U+02c6, U+02da,
    U+02dc, U+2000-206f, U+2074, U+20ac, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+feff, U+fffd;
}
html,
body {
  margin: 0;
  padding: 0;
  // font-family: Operator Mono Lig, Hasklig;
  font-family: Operator Mono Lig, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif !important;
  background-color: #f5f4f9;
  color: #000;
}
*,
:after,
:before {
  box-sizing: border-box;
}
button {
  display: inline;
  margin: 0;
  padding: 0;
  border: none;
  font: inherit;
  color: inherit;
  background: none;
}
u {
  text-decoration: none;
}

p {
  margin: 0;
}
#app .list {
  user-select: initial;
}
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
// vant-styles
.van-skeleton {
  padding: 0;
  .van-skeleton__title,
  .van-skeleton__row {
    height: 3rem;
    padding-bottom: 1rem;
  }
}
.van-empty {
  .van-empty__image {
    width: 220px;
    height: 220px;
  }
  .van-empty__description {
    font-size: 30px;
    font-family: fantasy;
    color: #cc5e5e;
    line-height: initial;
  }
}
.van-notify {
  text-align: left;
}
</style>
