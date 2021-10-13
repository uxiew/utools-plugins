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
      v-if="isNotEmpty('dependencies')"
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
      :checked="
        !keywords.length && isNotEmpty('dependencies') && !dependents.length
      "
    />
    <nav>
      <ul class="package-tabs-list">
        <li v-if="keywords.length" class="tab0">
          <label for="tab0">{{ getTabTitle('keyword') }}</label>
        </li>
        <li v-if="isNotEmpty('dependencies')" class="tab1">
          <label for="tab1">{{ getTabTitle('dependency') }}</label>
        </li>
        <li v-if="dependents.length" class="tab2">
          <label for="tab2">{{ getTabTitle('dependent') }}</label>
        </li>
        <li v-if="versions" class="tab3">
          <label for="tab3">{{ getTabTitle('version') }}</label>
        </li>
      </ul>
    </nav>
    <section>
      <div v-if="keywords.length" class="tab0">
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
      <!-- 兼容 npm.io 数组n结构 -->
      <div v-if="dependencies.length > 0" class="tab1">
        <div class="tags_list">
          <a
            v-for="(value, key) in dependencies"
            :key="key"
            class="tag_link"
            @click="getInfo(value)"
          >
            {{ value }}
          </a>
        </div>
      </div>
      <!-- yarnpkg 对象形式 -->
      <div v-else-if="isNotEmpty('dependencies')" class="tab1">
        <div class="tags_list">
          <a
            v-for="(value, key) in dependencies"
            :key="key"
            class="tag_link"
            @click="getInfo(formatVers(key, value))"
          >
            {{ key + '@' + value }}
          </a>
        </div>
      </div>
      <div v-if="dependents.length" class="tab2">
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
      <div v-if="versArrObj" class="tab3">
        <div class="version-list">
          <div
            v-for="(value, key, index) in versArrObj"
            :key="index"
            class="version-list-row"
          >
            <a class="version-number" @click="getInfo(`${pkgname}/v/${key}`)">
              {{ key }}
            </a>
            <p class="version-date">
              {{ value }}
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
  @Prop({ type: String }) pkgname!: '';
  @Prop({ type: Array }) keywords!: [];
  @Prop({ type: Array, default: () => [] }) dependents!: [];
  @Prop({ type: Object || Array }) dependencies!: [];
  @Prop({ type: Object }) versions!: {
    [prop: string]: string;
  };
  @Prop({ type: Function }) getInfo!: Function;

  // 数据转化,可能数组或者对象形式
  private isNotEmpty(prop: string): boolean {
    // @ts-ignore
    const data = this[prop];
    if (data.length === 0 || JSON.stringify(data) === '{}') return false;
    return true;
  }

  private formatVers(pkgName: string, versionStr: string) {
    return /^\^/.test(versionStr)
      ? `${pkgName}/v/${versionStr.replace('^', '')}`
      : `${pkgName}`;
  }

  get versArrObj() {
    const { versions } = this;
    let tmpObj: any = {};
    delete versions['created'];
    delete versions['modified'];
    const arr = Object.keys(versions).reverse();
    for (let item of arr) {
      tmpObj[item] = timeAgo(versions[item]);
    }
    return tmpObj;
  }

  // 底部三连跳转~~~
  searchKeyWords(keyword: string) {
    this.$router.replace({
      name: 'List',
      params: { type: 'keyword', keyword: 'keywords:' + keyword }
    });
    // await getKeyWordList(keyword);
  }

  // ==== 底部三标题 ====
  getTabTitle(cat: string) {
    let title = '0 keyword';
    const { keywords, versArrObj } = this;
    const dependencyLen =
      this.dependencies.length || Object.keys(this.dependencies).length;
    switch (cat) {
      case 'keyword':
        title =
          keywords.length + (keywords.length > 1 ? ' keywords' : ' keyword');
        break;
      case 'dependency':
        title =
          dependencyLen + (dependencyLen > 1 ? ' dependencies' : ' dependency');
        break;
      default:
        // eslint-disable-next-line no-case-declarations
        const verLen = Object.keys(versArrObj).length;
        title = verLen + (verLen > 1 ? ' versions' : ' version');
        break;
    }
    return title;
  }
}
</script>

<style lang="scss">
#tab0:checked ~ section .tab0,
#tab1:checked ~ section .tab1,
#tab2:checked ~ section .tab2,
#tab3:checked ~ section .tab3 {
  display: block;
}

.package-tabs {
  margin: 5rem 0 2rem;

  & > input,
  & section > div {
    display: none;
  }

  &-list {
    margin: 0;
    padding-left: 0 !important;
    list-style: none;
  }
  &-list li {
    display: inline-block;
  }
  &-list li label {
    cursor: pointer;
    float: left;
    padding: 0.75rem 1.2rem;
    margin: 0 0.8rem 0.8rem 0;
    font-size: 1rem;
    background-color: #fff;
    border: 1px solid #e1e1e4;
    border-radius: 0.375rem;
    color: #1001d4;
  }
  &-list li label:active,
  &-list li label:hover {
    border-color: #070f2b;
    box-shadow: 0.5rem 0.5rem 1rem 0 rgba(8, 15, 41, 0.08);
    color: inherit;
  }
  section {
    clear: both;
  }
}
#tab0:checked ~ nav .tab0 label,
#tab1:checked ~ nav .tab1 label,
#tab2:checked ~ nav .tab2 label,
#tab3:checked ~ nav .tab3 label {
  border-color: #0f11e2;
  box-shadow: 0.5rem 0.5rem 1rem 0 rgba(8, 15, 41, 0.08);
  color: inherit;
}
</style>
