<template>
  <div class="home-keywords">
    <div class="logo">
      <img src="../../assets/npm-io.png" alt="npm-io-logo" />
    </div>

    <van-cell-group inset>
      <van-cell title="最近搜索" icon="search" value="更多"></van-cell>
      <van-cell
        v-for="{ data: { name, version, description } } in searchHistory"
        :key="version"
        :title="name"
        :value="version"
        :label="description"
      />
    </van-cell-group>

    <van-cell-group inset>
      <van-cell title="收藏列表" icon="search"></van-cell>
      <van-cell
        v-for="{ name, version, description } in collection.npmList"
        :key="version"
        :title="name"
        :value="version"
        :label="description"
      />
    </van-cell-group>

    <!-- keywords -->
    <div class="tags_list">
      <van-skeleton :row="5" :loading="!wordsList.length">
        <span
          v-for="({ name }, index) in wordsList"
          :key="index"
          class="tag_link"
          @click="getInformation(name)"
        >
          {{ name }}
        </span>
      </van-skeleton>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-undef */
import { Vue, Component } from 'vue-property-decorator';
import { commonKeywords } from '../../utils/API';
// @ts-ignore
import Gitee from 'gitee-client';

interface TagType {
  name: string;
}
interface HistoryPkgType {
  name: string;
  version: string;
  description: string;
  [prop: string]: string;
}

@Component({
  name: 'home-keywords'
})
export default class Home extends Vue {
  private searchHistory: { data: HistoryPkgType }[] = [];
  private collection = {};
  private wordsList: TagType[] = [];

  async mounted() {
    this.searchHistory = utools.db.allDocs('searched');
    this.collection = await this.getCollection();
    window.collection = this.collection || {};

    // 关键字搜索
    this.wordsList = await commonKeywords();
  }

  private async getCollection() {
    const GITEE_TOKEN = process.env.VUE_APP_GITEE_TOKEN;
    const GIST_ID = process.env.VUE_APP_GIST_ID;
    const gee = new Gitee(GITEE_TOKEN);
    let {
      data: { files }
    } = await gee.get(`/v5/gists/${GIST_ID}`).catch(console.error);
    const collection = JSON.parse(files['npm-helper'].content);
    return collection;
  }

  private async getInformation(name: string) {
    utools.setSubInputValue('keywords:' + name);
  }
}
</script>

<style scoped lang="scss">
.home-keywords {
  position: relative;
  padding: 0 1rem;
  width: 100%;
}

.van-cell {
  user-select: text;
}
.logo {
  text-align: center;
  img {
    height: 160px;
    max-width: 100%;
  }
}
.tags_list {
  text-align: left;
  margin: 0 2.5rem;

  .tag_link {
    cursor: pointer;
    display: inline-block;
    padding: 0.5rem;
    margin: 0 0.6rem 0.6rem 0;
    font-size: 0.75rem;
    border-radius: 0.5rem;
    color: #000;
    background-color: #e1e2e8;
    text-decoration: none;
  }
}
</style>
