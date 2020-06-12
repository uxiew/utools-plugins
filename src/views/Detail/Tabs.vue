<template>
  <div class="package-tabs">
    <input
      v-if="keywords.length"
      id="tab0"
      type="radio"
      name="tab"
      :checked="keywords.length"
    />
    <input
      v-if="dependencies.length"
      id="tab1"
      type="radio"
      name="tab"
      :checked="!keywords.length"
    />
    <input
      v-if="dependents.length"
      id="tab2"
      type="radio"
      name="tab"
      :checked="!keywords.length && !dependencies.length"
    />
    <input
      v-if="versions"
      id="tab3"
      type="radio"
      name="tab"
      :checked="!keywords.length && !dependencies.length && !dependents.length "
    />
    <nav>
      <ul class="package-tabs-list">
        <li class="tab0">
          <label
            v-if="keywords.length"
            for="tab0"
          >{{ getTabTitle('keyword')}}</label>
        </li>
        <li
          v-if="dependencies.length"
          class="tab1"
        >
          <label for="tab1">{{ getTabTitle('dependency') }}</label>
        </li>
        <li
          v-if="dependents.length"
          class="tab2"
        >
          <label for="tab2">{{ getTabTitle('dependent') }}</label>
        </li>
        <li
          v-if="versions"
          class="tab3"
        >
          <label for="tab3">{{ getTabTitle('version') }}</label>
        </li>
      </ul>
    </nav>
    <section>
      <div
        v-if="keywords.length"
        class="tab0"
      >
        <div class="tags_list">
          <a
            v-for="item in keywords"
            :key="item"
            class="tag_link"
            @click="searchKeyWords(item)"
          >
            {{ item }}
          </a>
        </div>
      </div>
      <div
        v-if="dependencies.length"
        class="tab1"
      >
        <div class="tags_list">
          <a
            v-for="item in dependencies"
            :key="item"
            class="tag_link"
            @click="getInfo(item)"
          >
            {{ item }}
          </a>
        </div>
      </div>
      <div
        v-if="dependents.length"
        class="tab2"
      >
        <div class="tags_list">
          <a
            v-for="item in dependents"
            :key="item"
            class="tag_link"
            @click="getInfo(item)"
          >
            {{ item }}
          </a>
        </div>
      </div>
      <div
        v-if="versArrObj"
        class="tab3"
      >
        <div class="version-list">
          <div
            v-for="(value, key, index) in versArrObj"
            :key="index"
            class="version-list-row"
          >
            <a
              class="version-number"
              @click="getInfo(`${name}/v/${key}`)"
            >
              {{ key }}
            </a>
            <p class="version-date">
              {{ value | timeAgo }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { timeAgo } from '../../utils/util';

@Component({
  name: 'Tabs'
})
export default class Tabs extends Vue {
  @Prop({ type: Array, default: [] }) keywords!: [];
  @Prop({ type: Array, default: [] }) dependents!: [];
  @Prop({ type: Array, default: [] }) dependencies!: [];
  @Prop({ type: Object, default: {} }) versions!: {
    [prop: string]: string;
    created: string;
    modified: string;
  };
  @Prop({ type: Function }) getInfo!: Function;

  get versArrObj() {
    const { versions } = this;
    let tmpObj: any = {};
    delete versions['created'];
    delete versions['modified'];
    const arr = Object.keys(versions).reverse();
    for (let i = 0; i < arr.length; i++) {
      tmpObj[arr[i]] = timeAgo(versions[arr[i]]);
    }
    return tmpObj;
  }

  // 底部三连跳转~~~
  searchKeyWords(keyword: string) {
    this.$router.replace({
      name: 'List',
      params: { type: 'keyword', word: keyword }
    });
    // await getKeyWordList(keyword);
  }

  // ==== 底部三标题 ====
  getTabTitle(cat: string) {
    let title = '0 keyword';
    const { keywords, dependencies, dependents, versArrObj } = this;
    switch (cat) {
      case 'keyword':
        title =
          keywords!.length + (keywords!.length > 1 ? ' keywords' : ' keyword');
        break;
      case 'dependency':
        title =
          dependencies!.length +
          (dependencies!.length > 1 ? ' dependencies' : ' dependency');
        break;
      case 'dependent':
        title =
          dependents!.length +
          (dependents!.length > 1 ? ' dependents' : ' dependent');
        break;
      default:
        // eslint-disable-next-line no-case-declarations
        const verLen = Object.keys(versArrObj!).length;
        title = verLen + (verLen > 1 ? ' versions' : ' version');
        break;
    }
    return title;
  }
}
</script>


<style lang="scss">
</style>