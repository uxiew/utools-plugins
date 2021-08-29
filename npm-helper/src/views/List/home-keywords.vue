<template>
  <div class="home-keywords">
    <div class="logo">
      <img
        src="../../assets/npm-io.png"
        alt="npm-io-logo"
      >
    </div>
    <div class="tags_list">
      <van-skeleton
        :row="5"
        :loading="!wordsList.length"
      >
        <span
          v-for="({name}, index) in wordsList"
          :key="index"
          class="tag_link"
          @click="getInformation(name)"
        >{{name}}</span>
      </van-skeleton>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-undef */
import { Vue, Component } from 'vue-property-decorator';
import { commonKeywords } from '../../utils/API';

interface tagType {
  name: string;
}

@Component({
  name: 'home-keywords'
})
export default class Home extends Vue {
  private wordsList: tagType[] = [];

  async mounted() {
    this.wordsList = await commonKeywords();
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