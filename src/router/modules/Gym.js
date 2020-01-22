import Layout from '@/layout'

const GymRouter =     {
    path: '/Gym',
    component: Layout,
    redirect: 'Gym/index',
    meta: { title: 'Gym', icon: 'acc' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/Gym/Members/index'),
        name: 'Members',
        meta: { title: 'Members', icon: 'cost' }
      },
    /*  {
        path: 'NewMember',
        component: () => import('@/views/Gym/Members/NewMember'),
        name: 'NewMember',
        meta: { title: 'New Member', icon: 'Gym (1)' }
      },*/
      {
        path: 'Memberships',
        component: () => import('@/views/Gym/Memberships/index'),
        name: 'Memberships',
        meta: { title: 'Memberships', icon: 'accounts' }
      }
    ]
  }

export default GymRouter
