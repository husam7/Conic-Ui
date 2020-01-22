import Layout from '@/layout'

const AccountingRouter =     {
    path: '/Accounting',
    component: Layout,
    redirect: 'Accounting/TreeAccount',
    meta: { title: 'Accounting', icon: 'acc' },
    children: [
      {
        path: 'TreeAccount',
        component: () => import('@/views/Accounting/TreeAccount/index'),
        name: 'TreeAccount',
        meta: { title: 'TreeAccount', icon: 'cost' }
      },
      {
        path: 'EntryAccounting',
        component: () => import('@/views/Accounting/EntryAccounting/index'),
        name: 'EntryAccounting',
        meta: { title: 'EntryAccounting', icon: 'accounts' }
      },
      {
        path: 'NewAccountingEntry',
        component: () => import('@/views/Accounting/EntryAccounting/NewAccountingEntry'),
        name: 'NewAccountingEntry',
        meta: { title: 'NewAccountingEntry', icon: 'accounting (1)' }
      }
    ]
  }

export default AccountingRouter
