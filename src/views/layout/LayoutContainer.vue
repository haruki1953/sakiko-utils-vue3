<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MenuBar from './components/MenuBar.vue'
import FooterBar from './components/FooterBar.vue'
import { HomeFilled } from '@element-plus/icons-vue'
import { useElementSize } from '@vueuse/core'

const refFooterBarBox = ref<HTMLElement | null>(null)
const footerBarBoxSize = useElementSize(refFooterBarBox)

onMounted(async () => {
  //
})
</script>
<template>
  <el-backtop />
  <!-- 导航栏 -->
  <MenuBar
    :menu="[
      {
        index: '/',
        title: '首页',
        icon: HomeFilled
      },
      {
        index: '/utils',
        title: '小工具',
        icon: HomeFilled
      }
    ]"
  ></MenuBar>

  <div
    class="container"
    :style="{ paddingBottom: `${footerBarBoxSize.height.value}px` }"
  >
    <router-view></router-view>
    <div class="footer-bar-box" ref="refFooterBarBox">
      <FooterBar class="footer-bar"></FooterBar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-backtop {
  --el-backtop-bg-color: var(--color-background-mute);
  --el-backtop-hover-bg-color: var(--el-color-primary-light-8);
  transition: all 0.5s;
}
.page {
  height: 100vh;
}

// 响应式边距
$ref-padding-12: 120px;
$ref-padding-14: 200px;
$ref-padding-16: 300px;
$ref-padding-shim-12: 100px;
$ref-padding-shim-14: 150px;
$ref-padding-shim-16: 200px;
$ref-padding-top: 60px;
.container {
  padding: $ref-padding-top 20px 0 20px;
  margin: 0 auto;
  max-width: 1920px;
  min-height: 100vh;
  position: relative;
  .footer-bar-box {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    .footer-bar {
      margin: 20px;
    }
  }
}
@media (min-width: 1200px) {
  .container {
    padding: $ref-padding-top $ref-padding-12 0 $ref-padding-12;
  }
}
@media (min-width: 1400px) {
  .container {
    padding: $ref-padding-top $ref-padding-14 0 $ref-padding-14;
  }
}
@media (min-width: 1600px) {
  .container {
    padding: $ref-padding-top $ref-padding-16 0 $ref-padding-16;
  }
}
// 1920px将会以6列显示，所以将padding改小
// @media (min-width: 1920px) {
//   .container {
//     padding: $ref-padding-top 100px 20px 100px;
//   }
// }
</style>
