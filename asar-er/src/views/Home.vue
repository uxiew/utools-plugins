<template>
  <div class="home full-screen flex-center" @drop="onDrop" @dragover="onDragOver">
    <button class="asar-btn open" @click="open">打开一个 asar 存档</button>
  </div>
  <div class="plugins">
    <a v-for="asar in UPluginFiles" :key="asar.fileName" class="item">
      <div class="logo open" @click="goDetail(asar.fullPath)">
        <img :src="'file://' + asar.fullPath + '/' + asar.logo" alt="EFE" />
      </div>
      <div class="card-body">
        <div title="EFE" class="name">{{ asar.pluginName }} {{ 'v' + asar.version }}</div>
        <div title="asar.description" class="desc">
          {{ asar.description }}
        </div>
      </div>
      <div class="card-footer">
        <div :class="[asar.homepage ? 'open' : '']" @click="openHomePage(asar.homepage)">
          {{ asar.author }}
        </div>
        <div class="open" @click="goDetail(asar.fullPath)">More</div>
      </div>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { openFile } from '@/utils/index';
import { setAsarPath } from '@/store/store';

export default defineComponent({
  name: 'Home',
  data() {
    return {
      UPluginFiles: window.UPluginFiles,
    };
  },
  methods: {
    onDrop(e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
      // this.goDetail(e.dataTransfer!.files[0].path);
      // this.handleDrop(e.dataTransfer.files)
    },
    onDragOver(e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();
    },
    goDetail(path: string) {
      if (window.toRequire('path').extname(path) === '.asar') {
        setAsarPath(path);
        this.$router.push({ name: 'Detail' }).catch((err) => console.log(err));
      } else {
        alert('Not an asar file.');
      }
    },
    openHomePage(pageUrl: string) {
      pageUrl && utools.shellOpenExternal(pageUrl);
    },
    async open() {
      const path = await openFile();
      if (path) {
        this.goDetail(path);
      }
    },
    toggleDevtools() {
      const webContents = window.renderRemote.webContents.getFocusedWebContents();
      if (webContents.isDevToolsOpened()) {
        webContents.closeDevTools();
      } else {
        webContents.openDevTools();
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.home {
  background: linear-gradient(45deg, rgb(0, 120, 215), rgb(93, 169, 228));
}
.asar-btn {
  outline: none;
  background: transparent;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: #eee;
  padding: 12px;
}
.open {
  cursor: pointer;
}
.plugins {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px 10px;
  li {
    border: 1px solid rgb(83, 120, 149);
    padding: 8px;
    margin: 8px 0;
    &:hover {
      background: rgba(171, 195, 215, 0.4);
    }
    &:active {
      background: rgba(138, 162, 183, 0.6);
    }
  }

  .item {
    text-align: left;
    position: relative;
    width: 240px;
    background: #fff;
    color: #616161;
    display: inline-block;
    font-size: 14px;
    padding: 0 8px;
    margin-right: 12px;
    margin-bottom: 15px;
    transition: box-shadow 135ms cubic-bezier(0.4, 0, 0.2, 1),
      width 235ms cubic-bezier(0.4, 0, 0.2, 1);
    vertical-align: top;
    z-index: 1;
    border: 1px solid #fff;
    border-radius: 4px;
    box-shadow: rgba(51, 51, 51, 0.05) 0px 1px 3px 0px;
    color: #333;
    transition: box-shadow 135ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, opacity;

    &:focus,
    &:hover {
      box-shadow: 0 0.5rem 1rem rgb(51 51 51 / 10%);
      text-decoration: none;
      transform: translateY(-0.05rem);
    }
    &:last-child {
      margin-right: 0;
    }
    .logo {
      background-size: cover;
      border-radius: 50%;
      float: left;
      margin-top: 18px;
      margin-right: 14px;
      height: 44px;
      width: 44px;
      background-color: #fafafa;
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      img {
        width: 100%;
      }
    }

    .card-body {
      height: 80px;
      padding-top: 20px;
    }

    .name {
      font-size: 15px;
      color: #212121;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.2;
      margin: 0 0 8px;
    }

    .desc {
      font-size: 13px;
      color: #30333c;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      display: -webkit-box;
      white-space: normal;
      font-weight: 400;
      max-height: 70px;
      overflow: hidden;
      word-break: break-all;
    }

    .card-footer {
      clear: left;
      margin: 0;
      position: relative;
      color: inherit;
      padding: 14px 10px 12px;
      text-decoration: none;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
