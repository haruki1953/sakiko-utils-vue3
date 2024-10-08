import { createRouter, createWebHashHistory } from 'vue-router'
import LayoutContainer from '@/views/layout/LayoutContainer.vue'
import HomePage from '@/views/home/HomePage.vue'
import UtilsPage from '@/views/utils/UtilsPage.vue'
import { webName } from '@/config'
import { ref } from 'vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutContainer,
      children: [
        {
          path: '',
          name: 'home',
          component: HomePage,
          meta: { title: `` }
        },
        {
          path: '/utils',
          name: 'utils',
          component: UtilsPage,
          meta: { title: `小工具` }
        }
      ]
    }
  ],
  // 路由滚动行为定制
  scrollBehavior() {
    return {
      top: 0
    }
  }
})

// 路由加载标识（本项目不是异步导入，应该用处不大）
export const isLoading = ref(false)

// 路由访问拦截
router.beforeEach((to) => {
  // 路由加载标识
  isLoading.value = true

  // 根据路由设置页面标题
  if (to.meta.title) {
    document.title = (to.meta.title as string) + ' | ' + webName
  } else {
    document.title = webName
  }

  // 路由不存在，拦截到首页
  if (router.resolve(to.path).matched.length === 0) {
    return '/'
  }
})

router.afterEach(() => {
  isLoading.value = false
})

export default router
