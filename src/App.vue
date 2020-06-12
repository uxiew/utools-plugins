<template>
  <div id="app">
    <!--     <FileBrowser
      :search="false"
      :directory-listing="dir"
    /> -->
    <!-- <router-link to="/HelloWorld">Go to HelloWorld</router-link> -->
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import 'vant/es/skeleton/style';
import 'vant/es/empty/style';
import 'vant/es/popup/style';
import FileBrowser from './components/FileBrowser/index.vue';

@Component({
  name: 'App',
  components: {
    FileBrowser
  }
})
export default class App extends Vue {
  /*   private getName(e: any) {
    console.log("App on FileBrowser's Event:", e);
  }

  private s = false; */
  /*private dir = [
    ['assets', [['growl', ['error.png', 'ok.png']]]],
    ['bin', ['_mocha', 'mocha']],
    [
      'lib',
      [
        ['browser', ['growl.js', 'progress.js', 'template.html', 'tty.js']],
        [
          'cli',
          [
            'cli',
            'collect-files.js',
            'commands.js',
            'config.js',
            'index.js',
            'init.js',
            'node-flags.js',
            'one-and-dones.js',
            'options.js',
            'run-helpers.js',
            'run-option-metadata.js',
            'run.js',
            'watch-run.js'
          ]
        ],
        [
          'interfaces',
          [
            'bdd.js',
            'common.js',
            'exports.js',
            'index.js',
            'qunit.js',
            'tdd.js'
          ]
        ],
        [
          'reporters',
          [
            'base.js',
            'doc.js',
            'dot.js',
            'html.js',
            'index.js',
            'json-stream.js',
            'json.js',
            'landing.js',
            'list.js',
            'markdown.js',
            'min.js',
            'nyan.js',
            'progress.js',
            'spec.js',
            'tap.js',
            'xunit.js'
          ]
        ],
        'context.js',
        'errors.js',
        'esm-utils.js',
        'growl.js',
        'hook.js',
        'mocha.js',
        'mocharc.json',
        'pending.js',
        'runnable.js',
        'runner.js',
        'stats-collector.js',
        'suite.js',
        'test.js',
        'utils.js'
      ]
    ],
    'browser-entry.js',
    'CHANGELOG.md',
    'index.js',
    'LICENSE',
    'mocha.css',
    'mocha.js',
    'package.json',
    'README.md'
  ];*/
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
  font-size: 16px;
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
</style>
