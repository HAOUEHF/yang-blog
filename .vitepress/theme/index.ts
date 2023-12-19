import { h, nextTick, onMounted, watch, AsyncComponentLoader, defineAsyncComponent } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import DefaultTheme from 'vitepress/theme'
import './assets/styles/index.css'
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import Logo from './components/Logo.vue'
import Demo from 'vitepress-theme-demoblock/dist/client/components/Demo.vue'
import DemoBlock from 'vitepress-theme-demoblock/dist/client/components/DemoBlock.vue'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
// 导入异步组件加载器
const components = import.meta.glob('../../src/components/*/*vue')

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-title-before': () => h(Logo)
    })
  },
  setup() {
    const route = useRoute()
    const initZoom = () => {
      ; (mediumZoom as unknown as Function)('.main img', {
        background: 'var(--vp-c-bg)'
      })
    }

    onMounted(() => {
      initZoom()
    })
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  },
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    ctx.app.component('Demo', Demo)
    ctx.app.component('DemoBlock', DemoBlock)
    ctx.app.use(ElementPlus)
    for (const [key, value] of Object.entries(components)) {
      const components = key.split('/')
      const index = components.findIndex((item) => ['components'].includes(item))
      const name = components[index + 1]
      ctx.app.component(name, defineAsyncComponent(value as AsyncComponentLoader))
    }
  }
}
