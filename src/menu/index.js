import { uniqueId } from 'lodash'

// 插件
import demoPlugins from './modules/demo-plugins'
// 组件
import demoComponents from './modules/demo-components'
// 功能
import demoPlayground from './modules/demo-playground'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

// 菜单 侧边栏
export const menuAside = supplementPath([
  // { path: '/index', title: '首页', icon: 'home' },
  // {
  //   title: '页面',
  //   icon: 'folder-o',
  //   children: [
  //     { path: '/page1', title: '页面 1' },
  //     { path: '/page2', title: '页面 2' },
  //     { path: '/page3', title: '页面 3' },
  //     { path: '/page-demo', title: '新建示例' }
  //   ]
  // },
  demoComponents,
  demoPlugins,
  demoPlayground
])

// 菜单 顶栏
export const menuHeader = supplementPath([
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '页面',
    icon: 'folder-o',
    children: [
      { path: '/page1', title: '添加标签' },
      { path: '/page2', title: '查看标签' },
      { path: '/page3/2', title: '页面 3' },
      { path: '/page3/3', title: '页面 3' },
      { path: '/page-demo', title: '新建示例' },
      { path: '/addtag-main', title: '添加主标签' }
    ]
  },
  demoPlayground,
  demoComponents,
  demoPlugins
])
