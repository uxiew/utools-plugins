<template>
  <div class="list">
    <van-empty
      v-if="!!(npmList[0].error)"
      class="custom-image"
      :image="emptyImg"
      description="暂无数据"
    />
    <div
      v-for="({ name, version, description }, index) in npmList"
      v-else
      :key="index"
      class="list-item"
      @click="goPackageDetail(name)"
    >
      <!--
            <div class="list-item-icon">
            <img src="" alt=""></div>
            -->
      <div class="list-item-content">
        <div class="list-item-title">
          {{ name }}
          <span class="hint">{{ version }}</span>
        </div>
        <div class="list-item-description">{{ description }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// https://github.com/vst93/myDictionary-uToolsPlugin/blob/master/assets/index.js
import { Vue, Component } from 'vue-property-decorator';
import { getSuggestionList, getKeyWordList } from '../../utils/API';
import { _debounce } from '../../utils/util';
import noimage from '@/assets/custom-empty-image.png';

/* eslint-disable no-undef */
@Component({
  name: 'Main'
})
export default class Main extends Vue {
  private emptyImg = noimage;
  $bus!: any;
  private npmList: any[] = [{}];

  // public beforeRouteEnter(to: any, from: any, next: any) {
  //   next();
  //   console.log("beforeRouteLeave", this, to.path, from.path);
  // }

  goPackageDetail(name: string) {
    this.$router.push({
      name: 'Detail',
      params: { name }
    });
  }

  async fetchList(args: string) {
    this.npmList = (await getSuggestionList(args)) as any[];
    // 空数组砸吗？
    utools.setExpendHeight(560);
  }

  get searchText() {
    return this.$store.state.searchText;
  }

  created() {
    this.$bus.off('inputChange'); // 防止多次注册事件，触发请求
    this.$bus.on('inputChange', async (args: string) => {
      this.$store.dispatch('changeText', { searchText: args });
      if (this.$route.name !== 'List') {
        // this.$store.dispatch("changeText", { searchText: args });
        this.$bus.off('inputChange');
        this.$router.replace({
          name: 'List',
          params: { word: '' }
        });
      } else {
        _debounce(this.fetchList)(args);
      }
    });
  }

  async mounted() {
    const { word } = this.$route.params;
    if (word) {
      this.npmList = await getKeyWordList(word as string);
    } else {
      this.searchText && this.fetchList(this.searchText);
    }
  }
}
</script>

<style lang="scss">
@import './style.css';
</style>
