import React, { Fragment, useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import Header from '@components/Header'
import Layout from '@components/Layout'
import { Helmet } from 'react-helmet'
import { Container, Row } from '@styled/photo'
import { motion } from 'framer-motion'
import { isSEO, getLocationParams, usePreserveNSBP } from '@/utils'
import { useCurrentFlag } from '@utils/clientConfig'
import _ from 'lodash'
import { loadDataForContainer } from '@services/photo'

const springSettings = { type: 'spring' as const, stiffness: 170, damping: 26 }
const NEXT = 'show-next'

const Photo = ({ query, data, menu, getPhotoMenu }: any) => {
  const location = useLocation()
  let { from } = query
  const { withNSBP } = usePreserveNSBP()
  const photos = Array.isArray(data) ? data : []
  const [currPhoto, setCurrPhoto] = useState(0)
  // 使用 ref 来跟踪初始的 dic 值，用于区分首次加载和分类切换
  const initialDicRef = useRef<string | null>(null)

  const [currPhotoData, setCurrPhotoData] = useState(photos[0] || [0, 0, ''])

  const [currWidth, currHeight] = currPhotoData

  const widths = photos.map(
    ([origW, origH]: any) => (currHeight / origH) * origW
  )

  // 同步 currPhoto 和 currPhotoData
  useEffect(() => {
    if (photos[currPhoto]) {
      setCurrPhotoData(photos[currPhoto])
    }
  }, [currPhoto, photos])

  const leftStartCoords = widths
    .slice(0, currPhoto)
    .reduce((sum: any, width: any) => sum - width, 0)

  // Calculate position for each photo
  const photoPositions = photos.reduce(
    (acc: any, [_origW, _origH]: any, i: any, _arr: any) => {
      const prevLeft =
        i === 0 ? leftStartCoords : acc[i - 1].left + acc[i - 1].width
      acc.push({
        left: prevLeft,
        height: currHeight,
        width: widths[i] || 0
      })
      return acc
    },
    []
  )

  // console.log('photoPositions', photoPositions)

  const handleChange = ({ target: { value } }: any) => {
    setCurrPhoto(value)
  }

  const clickHandler = (btn: any) => {
    let photoIndex = btn === NEXT ? currPhoto + 1 : currPhoto - 1

    photoIndex = photoIndex >= 0 ? photoIndex : photos.length - 1
    photoIndex = photoIndex >= photos.length ? 0 : photoIndex

    setCurrPhoto(photoIndex)
  }

  useEffect(() => {
    const currentDic = getLocationParams('dic') || ''

    // 初始化时记录初始 dic 值
    if (initialDicRef.current === null) {
      initialDicRef.current = currentDic
    }

    const doGetPhotoMenu = () => {
      getPhotoMenu(currentDic)
    }

    // 判断是否需要加载数据：
    // 1. 客户端渲染模式（isSEO() === 0）- 总是加载
    // 2. 服务端渲染模式：
    //    - 如果没有数据（hasNoData）- 需要加载
    //    - 如果分类切换（isCategoryChanged）- 需要加载
    const isClientMode = isSEO() === 0
    const hasNoData = !data || data.length === 0
    const isCategoryChanged = currentDic !== initialDicRef.current

    // 客户端渲染模式：总是需要加载数据
    // 服务端渲染模式：只有在没有数据或分类切换时才加载
    if (isClientMode || hasNoData || isCategoryChanged) {
      doGetPhotoMenu()
    }

    // 重置到第一张
    setCurrPhoto(0)
  }, [location?.search, from])

  return (
    <Fragment>
      <Helmet>
        <title>Photo</title>
        <meta name="description" content="Photo Description" />
      </Helmet>
      <Header />

      <Layout query={query}>
        <Container>
          <Row>
            {_.map(menu, (item: any, index: number) => {
              return (
                <Link
                  key={`menu${index}`}
                  to={withNSBP(`/photo?dic=${item.name}`)}
                >
                  {item.name}
                </Link>
              )
            })}
          </Row>
          <Row>Scroll Me</Row>
          <Row>
            <button onClick={() => clickHandler('')}>Previous</button>
            <input
              type="range"
              min={0}
              max={photos.length - 1}
              value={currPhoto}
              onChange={handleChange}
            />
            <button onClick={() => clickHandler(NEXT)}>Next</button>
          </Row>
          <div className="demo4">
            <motion.div
              className="demo4-inner"
              animate={{ height: currHeight, width: currWidth }}
              transition={springSettings}
            >
              {photoPositions.map((pos: any, i: any) => (
                <motion.img
                  key={i}
                  className="demo4-photo"
                  src={
                    photos[i][2]
                      ? isSEO() === 1
                        ? `/images/${photos[i][2]}`
                        : `/images/${photos[i][2]}`
                      : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
                  }
                  initial={false}
                  animate={{
                    left: pos.left,
                    height: pos.height,
                    width: pos.width
                  }}
                  transition={springSettings}
                  style={{
                    position: 'absolute',
                    top: 0
                  }}
                />
              ))}
            </motion.div>
          </div>
        </Container>
      </Layout>
    </Fragment>
  )
}

const mapStateToProps = (state: any) => {
  return {
    query: state?.query,
    menu: state?.photo?.menu,
    data: state?.photo?.data
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  getPhotoMenu: (dic: any) => {
    dispatch(loadDataForContainer(null, dic))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Photo)
