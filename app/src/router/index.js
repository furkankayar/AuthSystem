import Vue from 'vue'
import Router from 'vue-router'
import api from '../api'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')


// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')
const RecoverPassword = () => import('@/views/pages/RecoverPassword')
const ResetPassword = () => import('@/views/pages/ResetPassword')

// Users
const Users = () => import('@/views/users/Users')
const User = () => import('@/views/users/User')

// Settings
const Settings = () => import('@/views/settings/Settings')

// Logs
const AccountLogs = () => import('@/views/logs/AccountLogs')
const UserPermissionLogs = () => import('@/views/logs/UserPermissionLogs')
const GroupLogs = () => import('@/views/logs/GroupLogs')
const GroupPermissionLogs = () => import('@/views/logs/GroupPermissionLogs')
const PermissionLogs = () => import('@/views/logs/PermissionLogs')
const ResetTokenLogs = () => import('@/views/logs/ResetTokenLogs')
const SessionLogs = () => import('@/views/logs/SessionLogs')
const UserLogs = () => import('@/views/logs/UserLogs')

// Groups
const Groups = () => import('@/views/groups/Groups')
const Group = () => import('@/views/groups/Group')
const AddGroup = () => import('@/views/groups/AddGroup')

// Permissions
const Permissions = () => import('@/views/permissions/Permissions')

Vue.use(Router)

let router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: TheContainer,
      beforeEnter: (to, from, next) => {
        api.is_token_valid(null)
          .then(res => {
            if (res.status === 200) {
              Vue.prototype.activeUser.username = res.data.username
              next()
            }
          })
          .catch(err => {
            if (err) {
              next('/pages/login')
            }
          })
      },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
          meta: { title: 'Dashboard' }
        },
        {
          path: 'users',
          meta: { label: 'Users'},
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Users,
              meta: { title: 'Users' }
            },
            {
              path: ':id',
              meta: { label: 'User Details', title: 'User Details'},
              name: 'User',
              component: User,
              beforeEnter: (to, from, next) => {
                if (from.path !== '/users') {
                  next('/users')
                } else {
                  next()
                }
              }
            },
          ]
        },
        {
          path: 'groups',
          meta: { label: 'Groups', title: 'Groups' },
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Groups,
              meta: { title: 'Groups' }
            },
            {
              path: 'new_group',
              meta: { label: 'New Group', title: 'New Group' },
              component: AddGroup
            },
            {
              path: ':id',
              meta: { label: 'Group Details', title: 'Group Details'},
              name: 'Group',
              component: Group,
            }
          ]
        },
        {
          path: 'permissions',
          meta: { label: 'Permissions', title: 'Permissions' },
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '',
              component: Permissions,
              meta: { title: 'Permissions' }
            },
          ]
        },
        {
          path: 'logs/account_log',
          component: AccountLogs,
          meta: {
            title: 'Account Logs',
            label: 'Account Logs'
          }
        },
        {
          path: 'logs/group_log',
          component: GroupLogs,
          meta: {
            title: 'Group Logs',
            label: 'Group Logs'
          }
        },
        {
          path: 'logs/user_permission_log',
          component: UserPermissionLogs,
          meta: {
            title: 'User Permission Logs',
            label: 'User Permission Logs'
          }
        },
        {
          path: 'logs/group_permission_log',
          component: GroupPermissionLogs,
          meta: {
            title: 'Group Permission Logs',
            label: 'Group Permission Logs'
          }
        },
        {
          path: 'logs/permission_log',
          component: PermissionLogs,
          meta: {
            title: 'Permission Logs',
            label: 'Permission Logs'
          }
        },
        {
          path: 'logs/reset_token_log',
          component: ResetTokenLogs,
          meta: {
            title: 'Reset Token Logs',
            label: 'Reset Token Logs'
          }
        },
        {
          path: 'logs/session_log',
          component: SessionLogs,
          meta: {
            title: 'Session Logs',
            label: 'Session Logs'
          }
        },
        {
          path: 'logs/user_log',
          component: UserLogs,
          meta: {
            title: 'User Logs',
            label: 'User Logs'
          }
        },
        {
          path: 'settings',
          component: Settings,
          meta: {
            title: 'Settings',
            label: 'Settings'
          }
        },
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'login',
          name: 'Login',
          component: Login,
          meta: {
            title: 'Login'
          },
          beforeEnter: (to, from, next) => {
            api.is_token_valid(null)
              .then(res => {
                if (res.status === 200) {
                  next('/dashboard')
                }
              })
              .catch(err => {
                if (err) {
                  next()
                }
              })
            }
        },
        {
          path: 'register',
          name: 'Register',
          component: Register,
          meta: {
            title: 'Register'
          },
          beforeEnter: (to, from, next) => {
            api.is_token_valid(null)
              .then(res => {
                if (res.status === 200) {
                  next('/dashboard')
                }
              })
              .catch(err => {
                if (err) {
                  next()
                }
              })
            }
        },
        {
          path: 'recover_password/:token',
          name: 'RecoverPassword',
          component: RecoverPassword,
          meta: {
            title: 'Recover Password'
          },
          beforeEnter: (to, from, next) => {
            api.check_reset_token({
              token: to.params.token
            })
            .then(res => {
              if (res.data.error === true) {
                next('/pages/login')
              } else {
                next()
              }
            })
            .catch(err => {
              if (err) {
                next('/pages/login')
              }
            })
          }
        },
        {
          path: 'recover_password',
          beforeEnter: (to, from, next) => {
            next('/pages/login')
          }
        },
        {
          path: 'reset_password',
          name: 'ResetPassword',
          component: ResetPassword,
          meta: {
            title: 'Reset Password'
          },
          beforeEnter: (to, from, next) => {
            if (from.path !== '/pages/login') {
              next('/pages/login')
            } else {
              next()
            }
          }
        },
      ]
    },
    {
      path: '*',
      name: 'Page404',
      component: Page404,
      meta:{
        title: '404 Not Found'
      }
    },
  ]
}

const DEFAULT_TITLE = 'DBMS';
router.afterEach((to, from) => {
    document.title = to.meta.title || DEFAULT_TITLE;
});

export default router
