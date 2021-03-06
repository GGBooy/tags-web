import playground from './modules/playground'
import plugins from './modules/plugins'
import components from './modules/components'

import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          title: '首页'
          // auth: true
        },
        component: _import('system/index')
      },
      {
        path: 'page1',
        name: 'page1',
        meta: {
          title: '添加标签'
          // auth: true
        },
        component: _import('demo/page1')
      },
      {
        path: 'page2',
        name: 'page2',
        meta: {
          title: '查看标签'
          // auth: true
        },
        component: _import('demo/page2')
      },
      {
        path: 'page3/:id',
        name: 'page3',
        meta: {
          title: '页面 3'
          // auth: true
        },
        component: _import('demo/page3')
      },
      {
        path: '/page-demo',
        name: 'page-demo',
        meta: {
          // auth: true,
          title: '新建示例'
        },
        component: () => import('@/pages/page-demo')
      },

      {
        path: '/page-tag/:id/:name',
        // path: '/page-tag/:id',
        name: 'page-tag',
        meta: {
          // auth: true,
          title: '标签列表'
        },
        component: () => import('@/pages/page-tag')

      },
      {
        path: '/addtag-main',
        // path: '/page-tag/:id',
        name: 'addtag-main',
        meta: {
          // auth: true,
          title: '添加主标签'
        },
        component: () => import('@/pages/addtag-main')

      },
      // {
      //   path: '/page-main',
      //   // path: '/page-tag/:id',
      //   name: 'page-main',
      //   meta: {
      //     // auth: true,
      //     title: '添加主标签'
      //   },
      //   component: () => import('@/pages/page-main')
      //
      // },

      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  },
  playground,
  plugins,
  components
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
