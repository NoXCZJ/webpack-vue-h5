const bannerRouter = [
  {
    path: '/test',
    component: () => import('@/views/test'),
    name: 'test',
    meta: { title: 'test', keepAlive: false }
  }
];

export default bannerRouter;
