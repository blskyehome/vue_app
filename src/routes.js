import DashView from './components/Dash.vue'
import LoginView from './components/Login.vue'
import NotFoundView from './components/404.vue'

// Import Views - Dash
import DashboardView from './components/views/Dashboard.vue'
import TablesView from './components/views/Tables.vue'
import TasksView from './components/views/Tasks.vue'
import SettingView from './components/views/Setting.vue'
import AccessView from './components/views/Access.vue'
import ServerView from './components/views/Server.vue'
import ReposView from './components/views/Repos.vue'
import LinkView from './components/views/Link.vue'
import CategoryView from './components/views/Category.vue'
import CategoryNewView from './components/views/CategoryNew.vue'
import Signout from './components/Signout.vue'
import UserAvatar from './components/views/UserAvatar.vue'
import UserInfo from './components/views/UserInfo.vue'

//  判断是否登录
function requireAuth (to, from, next) {
  console.log('via feathers method: ' + localStorage.getItem('token'))
  if (localStorage.getItem('token') === null) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}
// Routes
const routes = [
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/',
    component: DashView,
    beforeEnter: requireAuth,
    children: [
      {
        path: 'dashboard',
        alias: '',
        component: DashboardView,
        name: '仪表盘',
        meta: {description: 'Overview of environment'}
      }, {
        path: 'tables',
        component: TablesView,
        name: 'Tables',
        meta: {description: 'Simple and advance table in CoPilot'}
      }, {
        path: 'tasks',
        component: TasksView,
        name: 'Tasks',
        meta: {description: 'Tasks page in the form of a timeline'}
      }, {
        path: 'setting',
        component: SettingView,
        name: 'Settings',
        meta: {description: 'User settings page'}
      }, {
        path: 'access',
        component: AccessView,
        name: 'Access',
        meta: {description: 'Example of using maps'}
      }, {
        path: 'server',
        component: ServerView,
        name: 'Servers',
        meta: {description: 'List of our servers'}
      }, {
        path: 'repos',
        component: ReposView,
        name: 'Repository',
        meta: {description: 'List of popular javascript repos'}
      }, {
        path: 'link',
        component: LinkView,
        name: 'Link',
        meta: {description: 'List of user Link'}
      }, {
        path: 'user/category/:category_id/link',
        component: LinkView,
        name: 'Link',
        meta: {description: 'List of user Link'}
      }, {
        path: 'category',
        component: CategoryView,
        name: '分类',
        meta: {description: 'List of user Category'}
      }, {
        path: 'category/new',
        component: CategoryNewView,
        name: '新建分类',
        meta: {description: 'New Category'}
      }, {
        path: 'signout',
        component: Signout,
        name: '退出',
        meta: {description: 'New Category'}
      }, {
        path: 'user/avatar',
        component: UserAvatar,
        name: '设置头像',
        meta: {description: 'User Avatar'}
      }, {
        path: 'user/info',
        component: UserInfo,
        name: '设置用户信息',
        meta: {description: 'User Info'}
      }
    ]
  }, {
    // not found handler
    path: '*',
    component: NotFoundView
  }
]

export default routes
