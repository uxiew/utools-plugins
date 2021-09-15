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
import 'vant/es/skeleton/style';
import 'vant/es/empty/style';
import 'vant/es/popup/style';
import 'vant/es/notify/style';
import FileBrowser from './components/FileBrowser/index.vue';
import { translateYD } from './utils/API';

@Component({
  name: 'App',
  components: {
    FileBrowser
  }
})
export default class App extends Vue {
  private cashViews!: string[]; //待优化，点击刷新

  /* 
    beforeCreate
    constructor
    created
  */
  created() {
    this.cashViews = ['List', 'Detail']; //待优化，点击刷新

    // 右键单击手册，退出手册; 中键发送文本
    document.addEventListener('mousedown', (e: MouseEvent) => {
      if (3 == e.which) {
        // 右键
      } else if (1 == e.which) {
        // 左键
        this.$notify.clear();
      }
    });

    // 按键监听
    // idea 参考 https://hub.fastgit.org/fofolee/uTools-Manuals/blob/4c264bafc537d7a5971b14345c0f58dd097cc1c7/src/assets/index.js#L149
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      // const text = this.$store.state.searchText;
      const {
        $router,
        $route: { name }
      } = this;

      const selectText = document.getSelection()!.toString();
      switch (e.keyCode) {
        case 9:
          // TAB 键切换视图
          if (name === 'Detail') {
            $router.push({
              name: 'List',
              params: { tabKey: true }
            } as any);
          } else {
            $router.push({
              name: 'Detail',
              params: { tabKey: true }
            } as any);
          }
          break;

        case 13 || 108:
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
        case 114:
          // F3 键
          if (name === 'Detail') {
            utools.findInPage(this.$store.state.searchText);
          }
          break;
        // 上
        case 38:
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
        case 40:
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
        // 划词翻译
        case 84:
          if (name === 'Detail' && selectText) {
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
  // font-size: 16px;
  font-family: Roboto Mono, monospace, system-ui, -apple-system,
    BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
