<script setup lang="ts">
import { useSettingStore } from '@/stores'

const settingStore = useSettingStore()
</script>
<template>
  <div
    class="decoration-box"
    :class="{ 'dot-ani': settingStore.isLoadingData }"
  >
    <div class="dot-box sakiko"></div>
    <div class="dot-box umiri"></div>
    <div class="dot-box uika"></div>
    <div class="dot-box nyamu"></div>
    <div class="dot-box mutsumi"></div>
  </div>
</template>

<style lang="scss" scoped>
.decoration-box {
  display: flex;
}
$dot-size: 12px;
.dot-box {
  width: $dot-size;
  height: $dot-size;
  border-radius: calc($dot-size / 2);
  margin: 0 5px;
  transition: transform 0.5s;
  transform: scale(1);
  animation-name: dot;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
}
$interval: 0.24s;
.sakiko {
  background-color: var(--el-color-primary);
  animation-delay: 0;
}
.umiri {
  background-color: var(--el-color-info);
  animation-delay: $interval * 1;
}
.uika {
  background-color: var(--el-color-warning);
  animation-delay: $interval * 2;
}
.nyamu {
  background-color: var(--el-color-danger);
  animation-delay: $interval * 3;
}
.mutsumi {
  background-color: var(--el-color-success);
  animation-delay: $interval * 4;
}

.dot-ani .dot-box {
  animation-name: dotScale;
  animation-duration: $interval * 5 + 0.3s;
  // 播放次数无限
  animation-iteration-count: infinite;
}

@keyframes dotScale {
  /* 开始状态 */
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.5);
  }
  50% {
    transform: scale(1);
  }
  /* 结束状态 */
  100% {
    transform: scale(1);
  }
}
@keyframes dot {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
