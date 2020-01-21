export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer',
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Management']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Users',
        to: '/users',
        icon: 'cil-people'
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Groups',
        icon: 'cil-pin',
        items: [
          {
            name: 'Group List',
            to: '/groups',
            icon: 'cil-pin'
          },
          {
            name: 'New Group',
            to: '/groups/new_group',
            icon: 'cil-plus'
          }
        ]
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Permissions',
        to: '/permissions',
        icon: 'cil-bookmark'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Logs']
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Logs',
        route: '/logs',
        icon: 'cil-history',
        items: [
          {
            name: 'Account Logs',
            to: '/logs/account_log',
            icon: 'cil-description'
          },
          {
            name: 'User Logs',
            to: '/logs/user_log',
            icon: 'cil-description'
          },
          {
            name: 'Group Logs',
            to: '/logs/group_log',
            icon: 'cil-description'
          },
          {
            name: 'Permission Logs',
            to: '/logs/permission_log',
            icon: 'cil-description'
          },
          {
            name: 'Session Logs',
            to: '/logs/session_log',
            icon: 'cil-description'
          },
          {
            name: 'Group Permission Logs',
            to: '/logs/group_permission_log',
            icon: 'cil-description'
          },
          {
            name: 'User Permission Logs',
            to: '/logs/user_permission_log',
            icon: 'cil-description'
          },
          {
            name: 'Reset Token Logs',
            to: '/logs/reset_token_log',
            icon: 'cil-description'
          }
        ]
      }
    ]
  }
]
