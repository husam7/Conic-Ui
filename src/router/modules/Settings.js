import Layout from '@/layout'

const SettingsRouter =   {
    path: '/Settings',
    component: Layout,
    redirect: '/CompanyInfo',
    name: 'Settings',
    meta: {
      title: 'Settings',
      icon: 'setting',
    },
    children: [

      {
        path: '/Oprationsys',
        component: () => import('@/views/Settings/Oprationsys/index'),
        name: 'Oprationsys',
        meta: { title: 'Oprationsys', icon: 'execution' }
      },
      {
        path: '/CompanyInfo',
        component: () => import('@/views/Settings/CompanyInfo/index'),
        name: 'CompanyInfo',
        meta: { title: 'CompanyInfo', icon: 'company' }
      },
      {
        path: '/permission',
        component: () => import('@/views/Settings/index'),
        redirect: '/Settings/permission/page',
        alwaysShow: true, // will always show the root menu
        name: 'Permission',
        meta: {
          title: 'Permissions',
          icon: 'key',
          roles: ['admin', 'editor'] // you can set roles in root nav
        },
        children: [
          {
            path: 'page',
            component: () => import('@/views/Settings/permission/page'),
            name: 'PagePermission',
            meta: {
              title: 'PagePermission',
              icon:'pageper',
              roles: ['admin'] // or you can only set roles in sub nav
            }
          },
          {
            path: 'directive',
            component: () => import('@/views/Settings/permission/directive'),
            name: 'DirectivePermission',
            meta: {
              title: 'DirectivePermission',
              icon:'dirper',
              // if do not set roles, means: this page does not require permission
            }
          },
          {
            path: 'role',
            component: () => import('@/views/Settings/permission/role'),
            name: 'RolePermission',
            meta: {
              title: 'RolePermission',
              icon:'roleper',
              roles: ['admin']
            }
          }
        ]
      }

    ]
  }

export default SettingsRouter
