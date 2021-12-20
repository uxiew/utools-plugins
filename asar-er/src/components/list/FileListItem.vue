<template>
  <div class="row" @click.stop="onClick" :draggable="false" @dragstart="onDragStart">
    <div v-for="c in columns" :key="c.key" :class="c.className" :style="c.style">{{ c.text }}</div>
  </div>
</template>

<style lang="scss">
.row {
  display: flex;
}
</style>

<script lang="ts" src="./file_list_item.ts"></script>
