<template>
  <div class="home-keywords">
    <div class="logo">
      <img src="../../assets/npm-node.png" alt="npm-io-logo" />
    </div>

    <van-row type="flex" justify="space-between" gutter="14">
      <van-col span="8">
        <van-cell-group>
          <van-cell title="最近搜索" icon="search"></van-cell>
          <van-skeleton :row="5" :loading="!searchRecord.length">
            <div
              v-for="{ name, version, description } in searchRecord"
              :key="name + version"
              class="collection"
            >
              <div class="collection-title" @click="goPackageDetail(name)">
                {{ name }}
                <span>v{{ version }}</span>
              </div>
              <div
                class="collection-content"
                v-html="renderMD(description)"
              ></div>
            </div>
          </van-skeleton>
        </van-cell-group>
      </van-col>
      <van-col span="8">
        <van-cell-group>
          <van-cell is-link title="收藏列表" icon="search"></van-cell>
          <van-skeleton :row="5" :loading="!npmList.length">
            <div
              v-for="{ name, version, description } in npmList"
              :key="name + version"
              class="collection"
            >
              <div class="collection--title" @click="goPackageDetail(name)">
                {{ name }}
                <span>v{{ version }}</span>
              </div>
              <div
                class="collection-content"
                v-html="renderMD(description)"
              ></div>
            </div>
          </van-skeleton>
        </van-cell-group>
      </van-col>

      <!-- keywords -->
      <van-col span="8" class="tags_list">
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
      </van-col>
    </van-row>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-undef */
import { Vue, Component } from 'vue-property-decorator';
import marked from 'marked';
import { commonKeywords } from '../../utils/API';
import { getNpmList } from '../../utils/tcb';
// @ts-ignore
// import Gitee from 'gitee-client';

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
  private searchRecord: Array<HistoryPkgType> = [];
  private npmList: Array<HistoryPkgType> = [];
  private wordsList: TagType[] = [];

  async mounted() {
    this.searchRecord = await this.getCollection('history');
    this.npmList = await this.getCollection();
    // 关键字搜索
    this.wordsList = await commonKeywords();
  }

  goPackageDetail(name: string) {
    this.$router.push({
      name: 'Detail',
      params: { name }
    });
  }

  renderMD(str: string = '') {
    return marked.parse(str);
  }

  private async getCollection(type?: string) {
    const docs = await getNpmList(10, type);
    return docs;
  }
  //======== by gist data ========
  // private async getCollection() {
  //   const GITEE_TOKEN = process.env.VUE_APP_GITEE_TOKEN;
  //   const GIST_ID = process.env.VUE_APP_GIST_ID;
  //   const gee = new Gitee(GITEE_TOKEN);
  //   let {
  //     data: { files }
  //   } = await gee.get(`/v5/gists/${GIST_ID}`).catch(console.error);
  //   const collection = JSON.parse(files['npm-helper'].content);
  //   return collection;
  // }

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
  margin: 2rem;
  img {
    height: 120px;
    max-width: 100%;
  }
}
.tags_list {
  text-align: left;
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

.collection {
  background: #f1f1f1;
  padding: 5px 10px;
  span {
    color: #787878;
  }

  &-title {
    padding: 5px;
    cursor: pointer;
    &:hover {
      color: #515dde;
      span {
        color: #515dde;
      }
    }
  }

  &-content {
    color: #7b7b7b;
    padding: 10px 0;
    border-bottom: 1px solid #e4e4e4;
    overflow: hidden;
  }
}
</style>
