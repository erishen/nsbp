import React from 'react'
import { loadData as homeLoadData } from './services/home'
import { loadData as photoLoadData } from './services/photo'
import loadable from "@loadable/component"

const Loading = () => {
  return <div>Loading...</div>
}

const Home = loadable(() => import("./containers/Home"), {
  fallback: <Loading />
})

const Login = loadable(() => import("./containers/Login"), {
  fallback: <Loading />
})

const Photo = loadable(() => import("./containers/Photo"), {
  fallback: <Loading />
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
