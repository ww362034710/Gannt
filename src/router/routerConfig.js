let ignoreFile = ['Home.vue', 'Main.vue', 'NotFound.vue', 'Login.vue'];
const files = require.context('@/views', true, /\.vue$/);
let routes = [];
files.keys().forEach((key) => {
  let path = key.replace(/(\.\/|\/index|\.vue)/g, ''), //将./ /index  .vue 置换为空白
    fileUrl = key.replace(/\.\//g, ''), //匹配路径
    name = path.replace(/\//g, ''); //去除/
  name = name.charAt(0).toLowerCase() + name.slice(1);
  if (!ignoreFile.includes(fileUrl)) {
    routes.push({
      path: `/${name.replace('_', '/:')}`,
      name: name.replace(/_.*?$/g, ''),
      component: () =>
        import (`@/views/${fileUrl}`)
    });
  }

});
// console.log(routes)
export default [
  {
    path: '/',
    component: () => import ('../views/Main.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        title: '首页',
        component: () => import ('../pages/home.vue')
      },
      ...routes,
    ]
  },
  {
    path: "*",
    name: '404',
    component: () => import ('../views/NotFound.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import ('../views/Login.vue'),
    meta: {
      title: '登录'
    }
  }
]
