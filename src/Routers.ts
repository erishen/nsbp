import Home from './containers/Home' //引入Home组件
import Login from './containers/Login' //引入Login组件

export default [
  {
    path: '/',
    component: Home, //渲染Home组件
    exact: true, //严格匹配
    loadData: Home.loadData, //传入loadData方法
    key: 'Home' //用于后续循坏时提供key
  },
  {
    path: '/login',
    component: Login,
    exact: true,
    key: 'login'
  }
]
