import Layout from '@/layout'

const InventoryRouter =       {
    path: '/Inventorys',
    component: Layout,
    redirect: '/Inventory',
    name: 'Inventorys',
    meta: { title: 'Inventories', icon: 'inventory' },
    children: [
      {
        path: '/Items',
        component: () => import('@/views/Inventory/Item/index'),
        name: 'Items',
        meta: { title: 'Items', icon: 'item' }
      },
      {
        path: '/OrderInventories',
        component: () => import('@/views/Inventory/OrderInventories/index'),
        name: 'OrderInventories',
        meta: { title: 'OrderInventories', icon: 'orderinv' }
      },
      {
        path: '/NewOrderInventories',
        component: () => import('@/views/Inventory/OrderInventories/NewOrderInventories'),
        name: 'NewOrderInventories',
        meta: { title: 'NewOrderInventories', icon: 'box2' }
      },
      {
        path: '/Inventory',
        component: () => import('@/views/Inventory/index'),
        name: 'Inventory',
        meta: { title: 'Inventory', icon: 'inventory (1)' }
      },
      {
        path: '/Classifications',
        redirect: '/MenuItem',
        component: () => import('@/views/Inventory/Classifications/index'),
        meta: { title: 'Classifications', icon: 'technical-support' },
        children: [
          {
            path: '/MenuItem',
            component: () => import('@/views/Inventory/Classifications/MenuItem/index'),
            name: 'MenuItem',
            meta: { title: 'MenuItem', icon: 'maintenance' }
          },
          {
            path: '/OriginItem',
            component: () => import('@/views/Inventory/Classifications/OriginItem/index'),
            name: 'OriginItem',
            meta: { title: 'OriginItem', icon: 'flags' }
          },
          {
            path: '/UnitItem',
            component: () => import('@/views/Inventory/Classifications/UnitItem/index'),
            name: 'UnitItem',
            meta: { title: 'UnitItem', icon: 'design-tool' }
          }
        ]
      },
      {
        path: '/Stocktaking',
        redirect: '/StockItem',
        component: () => import('@/views/Inventory/Stocktaking/index'),
        meta: { title: 'Stocktaking', icon: 'stocktake' },
        children: [
          {
            path: '/StockItem',
            component: () => import('@/views/Inventory/Stocktaking/StockItem/index'),
            name: 'StockItem',
            meta: { title: 'StockItem', icon: 'stockitem' }
          },
          {
            path: '/NewStock',
            component: () => import('@/views/Inventory/Stocktaking/NewStock/index'),
            name: 'NewStock',
            meta: { title: 'NewStock', icon: 'newstock' }
          }
        ]
      }
     
    ]
  }

export default InventoryRouter
