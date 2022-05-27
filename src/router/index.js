import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/electron',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'electron',
        component: () => import('@/views/electron/index'),
        meta: { title: '电子病历', icon: 'electron' }
      }
    ]
  },
  {
    path: '/handlerE',
    component: Layout,
    children: [
      {
        path: 'handlerE',
        name: 'handlerE',
        component: () => import('@/views/electron/handler/index'),
        meta: { title: '处理预约', icon: 'form' }
      }
    ],
    hidden: true
  },
  {
    path: '/people',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'people',
        component: () => import('@/views/people/index'),
        meta: { title: '个人信息', icon: 'form' }
      }
    ],
    hidden: true
  },

  { path: '*', redirect: '/404', hidden: true }
]

window.localStorage.getItem('roles') == 1
  ? constantRoutes.push(
      // 文章资讯
      {
        path: '/data',
        component: Layout,
        name: 'data',
        meta: { title: '数据管理', icon: 'data' },
        children: [
          {
            path: 'heathy',
            name: 'heathy',
            component: () => import('@/views/heathy_data/index'),
            meta: { title: '健康生理数据', icon: 'heathy' }
          },
          {
            path: 'life',
            name: 'life',
            component: () => import('@/views/life/index'),
            meta: { title: '生活习惯数据', icon: 'life' }
          }
        ]
      },
      {
        path: '/diease',
        component: Layout,
        name: 'Diease',
        meta: { title: '疾病管理', icon: 'diease' },
        children: [
          {
            path: 'index',
            name: 'nowDisease',
            component: () => import('@/views/now_disease/index'),
            meta: { title: '现患疾病', icon: 'nowDisease' }
          },
          {
            path: 'history',
            name: 'history',
            component: () => import('@/views/history_disease/index'),
            meta: { title: '既往疾病', icon: 'history' }
          },
          {
            path: 'family',
            name: 'family',
            component: () => import('@/views/familyDiease/index'),
            meta: { title: '家族疾病', icon: 'familyDiease' }
          }
        ]
      },

      // 推荐管理
      {
        path: '/suggestion',
        component: Layout,
        name: 'Suggestion',
        meta: { title: '推荐管理', icon: 'suggestion' },
        children: [
          {
            path: 'sport',
            name: 'sport',
            component: () => import('@/views/sport/index'),
            meta: { title: '运动管理', icon: 'sport' }
          },
          {
            path: 'foods',
            name: 'foods',
            component: () => import('@/views/foods/index'),
            meta: { title: '膳食管理', icon: 'foods' }
          }
        ]
      },
      {
        path: '/community',
        component: Layout,
        children: [
          {
            path: 'community',
            name: 'community',
            component: () => import('@/views/community/index'),
            meta: { title: '社区内容', icon: 'community' }
          }
        ]
      },
      {
        path: '/detail',
        component: Layout,
        children: [
          {
            path: '/detail/:id',
            name: 'detail',
            component: () => import('@/views/detail/index'),
            meta: { title: '新闻详情', icon: 'dashboard' }
          }
        ],
        hidden: true
      },
      {
        path: '/fabu',
        component: Layout,
        children: [
          {
            path: 'fabu',
            name: 'fabu',
            component: () => import('@/views/fabu/index'),
            meta: { title: '发布', icon: 'dashboard' }
          }
        ],
        hidden: true
      }
    )
  : ''

window.localStorage.getItem('roles') == 2
  ? constantRoutes.push(
      {
        path: '/resident',
        component: Layout,
        children: [
          {
            path: 'index',
            name: 'resident',
            component: () => import('@/views/resident/index'),
            meta: { title: '档案管理', icon: 'resident' }
          }
        ]
      },
      {
        path: '/appointment',
        component: Layout,
        children: [
          {
            path: 'index',
            name: 'appointment',
            component: () => import('@/views/appointment/index'),
            meta: { title: '预约管理', icon: 'appointment' }
          }
        ]
      },
      // 推荐管理
      {
        path: '/products',
        component: Layout,
        name: 'products',
        meta: { title: '药品管理', icon: 'products' },
        children: [
          {
            path: 'medicine',
            name: 'medicine',
            component: () => import('@/views/products/medicine/index'),
            meta: { title: '基本信息', icon: 'medicine' }
          },
          {
            path: 'store',
            name: 'store',
            component: () => import('@/views/products/store/index'),
            meta: { title: '库存信息', icon: 'store' }
          }
        ]
      },
      // 文章资讯
      {
        path: '/artilcle',
        component: Layout,
        name: 'Artilcle',
        meta: { title: '文章资讯', icon: 'article' },
        children: [
          {
            path: 'articles',
            name: 'articles',
            component: () => import('@/views/artilcle/articles/index'),
            meta: { title: '文章管理', icon: 'articles' }
          },
          {
            path: 'notice',
            name: 'notice',
            component: () => import('@/views/artilcle/notice/index'),
            meta: { title: '公告通知', icon: 'notice' }
          },
          {
            path: 'news',
            name: 'news',
            component: () => import('@/views/artilcle/news/index'),
            meta: { title: '新闻', icon: 'news' }
          }
        ]
      },
      {
        path: '/news',
        component: Layout,
        children: [
          {
            path: 'addaritcles/:id',
            name: 'addaritcles',
            component: () => import('@/views/artilcle/articles/addaritcles'),
            meta: { title: 'Form', icon: 'form' }
          }
        ],
        hidden: true
      },

      {
        path: '/system',
        component: Layout,
        name: 'System',
        meta: { title: '系统管理', icon: 'system' },
        children: [
          {
            path: 'user',
            name: 'user',
            component: () => import('@/views/system/user/index'),
            meta: { title: '用户管理', icon: 'user' }
          },
          {
            path: 'roles',
            name: 'roles',
            component: () => import('@/views/system/roles/index'),
            meta: { title: '角色管理', icon: 'roles' }
          },
          {
            path: 'log',
            name: 'log',
            component: () => import('@/views/system/log/index'),
            meta: { title: '日志管理', icon: 'log' }
          }
        ]
      }
    )
  : ''

const createRouter = () =>
  new Router({
    // mode:'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
