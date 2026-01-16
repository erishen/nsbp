import React from 'react'
import { loadData as homeLoadData } from '@services/home'
import { loadData as photoLoadData } from '@services/photo'
import loadable from '@loadable/component'

const Loading = () => {
  return <div>Loading...</div>
}

const Home = loadable(() => import('@containers/Home'), {
  fallback: <Loading />
})

const Login = loadable(() => import('@containers/Login'), {
  fallback: <Loading />
})

const Photo = loadable(() => import('@containers/Photo'), {
  fallback: <Loading />
})

export default [
  {
    path: '/',
    element: <Home />,
    loadData: homeLoadData, //传入loadData方法
    key: 'home'
  },
  {
    path: '/login',
    element: <Login />,
    key: 'login'
  },
  {
    path: '/photo',
    element: <Photo />,
    loadData: photoLoadData, // 使用 photo 的 loadData 来预取图片数据
    key: 'photo'
  }
]
