<template>
  <div class="progress" :style="{ backgroundColor: infinity ? '#e6e6e6' : '#06b025' }">
    <template v-if="infinity">
      <div class="progress-infinity"></div>
    </template>
    <template v-else>
      <div class="slide"></div>
      <div class="progress-rest" :style="{ width: 100 - percent + '%' }"></div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    infinity: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: 100,
    },
    min: {
      type: Number,
      default: 0,
    },
    pos: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    computedMax(): number {
      return this.max <= this.min ? 100 : this.max;
    },
    computedMin(): number {
      return this.max <= this.min ? 0 : this.min;
    },
    computedPos(): number {
      let computedPos = 0;
      if (this.pos < this.computedMin) {
        computedPos = this.computedMin;
      } else if (this.pos > this.computedMax) {
        computedPos = this.computedMax;
      } else {
        computedPos = this.pos;
      }
      return computedPos;
    },
    percent(): number {
      return ((this.computedPos - this.computedMin) / (this.computedMax - this.computedMin)) * 100;
    },
  },
});
</script>

<style lang="scss" scoped>
@keyframes progress-move {
  from {
    left: -100px;
  }
  to {
    left: 100%;
  }
}
@keyframes progress-move-infinity {
  from {
    left: -127px;
  }
  to {
    left: 100%;
  }
}
.progress {
  position: relative;
  width: 100%;
  height: 25px;
  border: 1px solid #bcbcbc;
  box-sizing: border-box;
  overflow: hidden;
  .progress-rest {
    background-color: #e6e6e6;
    height: 100%;
    position: absolute;
    right: 0;
  }
  .slide {
    animation: progress-move 2s infinite linear;
    position: absolute;
    width: 100px;
    height: 100%;
    background: linear-gradient(
      to right,
      #06b025 calc(50% - 40px),
      #6fe075 50%,
      #06b025 calc(50% + 40px)
    );
  }
  .progress-infinity {
    animation: progress-move-infinity 2.5s infinite linear;
    background-color: #06b025;
    width: 127px;
    height: 100%;
    position: absolute;
  }
}
</style>
