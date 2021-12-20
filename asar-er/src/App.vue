<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { setAsarPath } from '@/store/store';

export default defineComponent({
  name: 'Home',
  created() {
    utools.onPluginEnter(({ code, type, payload }) => {
      // TODO 目前只能一次查看一个 asar 包
      const filePath = payload[0].path;
      if (type === 'files' && payload[0].isFile) {
        setAsarPath(filePath);
        this.$router.push({ name: 'Detail' }).catch((err) => console.log(err));
      }
    });
  },
});
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
html,
body {
  margin: 0;
  font-size: 18px;
  background-color: #f7f7f9;
}
ul {
  list-style: none;
  text-align: left;
  margin: 0;
  padding: 0;
}
</style>
