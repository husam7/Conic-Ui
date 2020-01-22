import Layout from '@/layout'

const PurchasesRouter = {
    path: '/Purchases',
    component: Layout,
    redirect: '/Purchases/PurchaseInvoice',
    meta: { title: 'Purchases', icon: 'shopping-cart' },
    children: [
      {
        path: 'NewPurchaseInvoice',
        component: () => import('@/views/Purchase/NewPurchaseInvoice'),
        name: 'NewPurchaseInvoice',
        meta: { title: 'NewPurchaseInvoice', icon: 'add-file' }
      },
      {
        path: 'PurchaseInvoice',
        component: () => import('@/views/Purchase/index'),
        name: 'PurchaseInvoice',
        meta: { title: 'PurchaseInvoice', icon: 'research' }
      },
      {
        path: 'PurchaseItems',
        component: () => import('@/views/Purchase/PurchaseItems'),
        name: 'PurchaseItems',
        meta: { title: 'PurchaseItems', icon: 'shopping-cart (1)' }
      }
    ]
  }

export default PurchasesRouter
