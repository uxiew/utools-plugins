<template>
  <div class="list">
    <home-keywords v-if="!npmList.length && !npmList.error" />
    <van-empty v-if="!!npmList.error" class="custom-image" :image="emptyImg" description="暂无数据" />
    <div
      v-for="({ name, version, description, owner, types, license, modified, keywords }, index) in npmList"
      v-else
      :key="index"
      :class="{ 'list-item': true, selected: index === 0 }"
    >
      <!--
            <div class="list-item-icon">
            <img src="" alt=""></div>
            -->
      <div class="list-item-content">
        <div class="list-item-title" @click="goPackageDetail(name)">
          <span class="pkg-name">{{ name }}</span>
          <span class="hint">{{ version }}</span>
          <span v-if="owner">
            <span v-if="license" class="license" v-html="license"></span>
            <img
              v-if="types.ts === 'included'"
              class="ts-icon"
              alt="TypeScript support: included"
              title="TypeScript support: included"
              src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHdpZHRoPSIxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJtMzMgMjM1aDhjLjU1MjI4NDcgMCAxIC40NDc3MTUgMSAxdjhjMCAuNTUyMjg1LS40NDc3MTUzIDEtMSAxaC04Yy0uNTUyMjg0NyAwLTEtLjQ0NzcxNS0xLTF2LThjMC0uNTUyMjg1LjQ0NzcxNTMtMSAxLTF6bTQuNjA3MDMxMyA0LjkwODgxOXYtLjgzMTI0OGgtMy42MDcwMzEzdi44MzEyNDhoMS4yODc3NzM0djMuNzAxMTFoMS4wMjUxNTYzdi0zLjcwMTExem0uNDA4NzIzNSAzLjUyNTgxNWMuMTY1MzE4Ni4wODQyODkuMzYwODM2Ni4xNDc1MDUuNTg2NTYwMS4xODk2NS4yMjU3MjM0LjA0MjE0NC40NjM2MzAyLjA2MzIxNi43MTM3Mjc1LjA2MzIxNi4yNDM3Mzg5IDAgLjQ3NTI4NzQtLjAyMzE3OS42OTQ2NTI0LS4wNjk1MzguMjE5MzY1MS0uMDQ2MzU5LjQxMTcwNC0uMTIyNzQ1LjU3NzAyMjUtLjIyOTE2LjE2NTMxODYtLjEwNjQxNS4yOTYxOTM4LS4yNDU0ODkuMzkyNjI5Ny0uNDE3MjI4LjA5NjQzNTgtLjE3MTczOS4xNDQ2NTMtLjM4NDAzOS4xNDQ2NTMtLjYzNjkwNiAwLS4xODMzMjktLjAyNzU1MjctLjM0NDAwMi0uMDgyNjU4OS0uNDgyMDI2LS4wNTUxMDYyLS4xMzgwMjMtLjEzNDU4NS0uMjYwNzY3LS4yMzg0MzktLjM2ODIzNS0uMTAzODU0LS4xMDc0NjktLjIyODM3MDktLjIwMzg3My0uMzczNTU0NS0uMjg5MjE2LS4xNDUxODM2LS4wODUzNDItLjMwODkxMDEtLjE2NTk0Mi0uNDkxMTg0NS0uMjQxODAzLS4xMzM1MjY1LS4wNTQ3ODctLjI1MzI3NDctLjEwNzk5NC0uMzU5MjQ4MS0uMTU5NjIxLS4xMDU5NzM1LS4wNTE2MjctLjE5NjA0OTUtLjEwNDMwNy0uMjcwMjMxLS4xNTgwNDEtLjA3NDE4MTQtLjA1MzczNS0uMTMxNDA2Mi0uMTEwNjI5LS4xNzE2NzYxLS4xNzA2ODVzLS4wNjA0MDQ1LS4xMjgwMTMtLjA2MDQwNDUtLjIwMzg3M2MwLS4wNjk1MzguMDE4MDE1Mi0uMTMyMjI3LjA1NDA0NjItLjE4ODA2OS4wMzYwMzA5LS4wNTU4NDEuMDg2ODk3NC0uMTAzNzguMTUyNjAwOS0uMTQzODE3LjA2NTcwMzYtLjA0MDAzNy4xNDYyNDIyLS4wNzExMTkuMjQxNjE4My0uMDkzMjQ0LjA5NTM3NjEtLjAyMjEyNi4yMDEzNDc5LS4wMzMxODkuMzE3OTE4Ny0uMDMzMTg5LjA4NDc3ODggMCAuMTc0MzI1LjAwNjMyMi4yNjg2NDEzLjAxODk2NS4wOTQzMTY0LjAxMjY0My4xODkxNjEyLjAzMjEzNS4yODQ1MzczLjA1ODQ3NXMuMTg4MTAxNS4wNTk1MjkuMjc4MTc4OS4wOTk1NjYuMTczMjY1My4wODYzOTYuMjQ5NTY2Mi4xMzkwNzZ2LS45NDUwODZjLS4xNTQ3MjEyLS4wNTkwMDItLjMyMzc0NjMtLjEwMjcyNi0uNTA3MDgwNC0uMTMxMTc0LS4xODMzMzQtLjAyODQ0Ny0uMzkzNjg4Mi0uMDQyNjcxLS42MzEwNjg3LS4wNDI2NzEtLjI0MTYxOTQgMC0uNDcwNTE4Ni4wMjU4MTMtLjY4NjcwNDQuMDc3NDRzLS40MDY0MDUzLjEzMjIyNy0uNTcwNjY0MS4yNDE4MDNjLS4xNjQyNTg5LjEwOTU3Ni0uMjk0MDc0NC4yNDkxNzctLjM4OTQ1MDUuNDE4ODA5cy0uMTQzMDYzNC4zNzI0NDktLjE0MzA2MzQuNjA4NDU4YzAgLjMwMTMzNC4wODc0MjY4LjU1ODQxMS4yNjIyODI5Ljc3MTI0MS4xNzQ4NTYyLjIxMjgzLjQ0MDMxNTcuMzkyOTk1Ljc5NjM4NjUuNTQwNTAxLjEzOTg4NDkuMDU2ODk1LjI3MDIzMDMuMTEyNzM2LjM5MTA0LjE2NzUyMy4xMjA4MDk3LjA1NDc4OC4yMjUxOTIuMTExNjgzLjMxMzE1LjE3MDY4NS4wODc5NTc5LjA1OTAwMi4xNTczNjk1LjEyMzI3Mi4yMDgyMzY3LjE5MjgxLjA1MDg2NzMuMDY5NTM5LjA3NjMwMDUuMTQ4NTU4LjA3NjMwMDUuMjM3MDYyIDAgLjA2NTMyNC0uMDE1ODk1OC4xMjU5MDYtLjA0NzY4NzguMTgxNzQ3LS4wMzE3OTIuMDU1ODQyLS4wODAwMDkyLjEwNDMwNy0uMTQ0NjUzLjE0NTM5OHMtLjE0NTE4MjQuMDczMjI2LS4yNDE2MTgzLjA5NjQwNWMtLjA5NjQzNTguMDIzMTc5LS4yMDkyOTU4LjAzNDc2OS0uMzM4NTgzNC4wMzQ3NjktLjIyMDQyNDggMC0uNDM4NzI2OC0uMDM4NDU2LS42NTQ5MTI2LS4xMTUzN3MtLjQxNjQ3MjYtLjE5MjI4My0uNjAwODY2NC0uMzQ2MTF6IiBmaWxsPSIjMTg3YWJmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zMiAtMjM1KSIvPgo8L3N2Zz4K"
            />
          </span>
        </div>
        <div class="list-item-description" v-html="description"></div>
        <div v-if="owner" class="list-item-bottom">
          <a class="owner">
            <img width="28" height="28" alt="owner" :src="`https://res.cloudinary.com/hilnmyskv/image/fetch/w_40,h_40,f_auto,q_80,fl_lossy/${owner.avatar}`" />
            {{ owner.name }}
          </a>
          <span class="hint">{{ modified | timeAgo }}</span>
        </div>

        <div v-if="keywords && keywords.length" class="tags_list">
          <span v-for="(keyword, i) in keywords" :key="i" class="tag_link" @click="getKeywordInf(keyword)">{{ keyword }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// https://github.com/vst93/myDictionary-uToolsPlugin/blob/master/assets/index.js
import { Vue, Component } from 'vue-property-decorator'
import homeKeywords from './home-keywords.vue'

import { getSuggestionList, getKeyWordList } from '../../utils/API'
import { _debounce } from '../../utils/util'
import noimage from '@/assets/custom-empty-image.png'

/* eslint-disable no-undef */
@Component({
  name: 'List',
  components: {
    'home-keywords': homeKeywords
  }
})
export default class List extends Vue {
  private emptyImg = noimage
  private npmList: any[] | {} = []

  goPackageDetail(name: string) {
    this.$router.push({
      name: 'Detail',
      params: { name }
    })
  }

  async fetchList(args: string) {
    this.npmList = args.includes('keywords:') ? await getKeyWordList(args) : ((await getSuggestionList(args)) as any[])
    utools.setExpendHeight(660)
  }

  getKeywordInf(keyName: string) {
    utools.setSubInputValue('keywords:' + keyName)
  }

  private utoolSetInput() {
    utools.setSubInput(({ text }) => {
      const txt = text.trim()
      if (!txt) {
        return
      }
      _debounce(this.fetchList)(text)
    }, '输入包名，或输入 keywords:angular 搜索相关库')
  }

  created() {
    utools.onPluginEnter(({ type, payload }) => {
      this.utoolSetInput()
      if (type === 'over') {
        utools.setSubInputValue(payload)
        // getSuggestionList(payload);
      }
    })
  }

  async mounted() {
    this.utoolSetInput()
    const { keyword } = this.$route.params
    if (keyword) {
      utools.setSubInputValue(keyword)
    }
  }
}
</script>

<style scoped lang="scss">
@import './style.css';
// yarnpkg
.selected {
  background-color: #e4e4e4;
}
.list-item-title {
  .license {
    font-size: 0.75rem;
    color: rgba(0, 0, 0, 0.5);
    margin: 0 8px;
    letter-spacing: 0.2px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(204, 204, 204);
    border-image: initial;
    padding: 2px 4px;
    border-radius: 4px;
  }
  .ts-icon {
    margin-left: 0.2em;
    width: 0.8em;
    height: 0.8em;
    vertical-align: middle;
  }
}
.list-item-bottom {
  margin-top: 4px;
  a {
    color: #222;
    text-decoration: none;
  }
  img {
    vertical-align: middle;
    margin-right: 4px;
  }
  .owner {
    font-size: 0.69rem;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.7);
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin-right: 8px;
  }
}
.tags_list {
  text-align: left;
  .tag_link {
    cursor: pointer;
    display: inline-block;
    padding: 0.5rem;
    margin: 0.4rem 0.4rem 0;
    font-size: 0.75rem;
    border-radius: 0.5rem;
    color: #000;
    background-color: #e1e2e8;
    text-decoration: none;
  }
}
</style>
