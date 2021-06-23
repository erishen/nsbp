import React from 'react'
import Loadable from 'react-loadable'
import { loadData as homeLoadData } from './services/home'
import { loadData as photoLoadData } from './services/photo'

const Loading = () => {
  return <div>Loading...</div>
}

const Home = Loadable({
  loader: () => import('./containers/Home'),
  loading: Loading
})

const Login = Loadable({
  loader: () => import('./containers/Login'),
  loading: Loading
})

const Photo = Loadable({
  loader: () => import('./containers/Photo'),
  loading: Loading
})

export default [
  {
    path: '/',
    component: Home, //渲染Home组件
    exact: true, //严格匹配
    loadData: homeLoadData, //传入loadData方法
    key: 'home' //用于后续循坏时提供key
  },
  {
    path: '/login',
    component: Login,
    exact: true,
    key: 'login'
  },
  {
    path: '/photo',
    component: Photo,
    exact: true,
    loadData: photoLoadData, 
    key: 'photo'
  }
]
