import React, { Fragment, useState, useEffect, useRef, useMemo } from 'react'
import { connect } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import Header from '@components/Header'
import Layout from '@components/Layout'
import { Helmet } from 'react-helmet'
import { Container, Row } from '@styled/photo'
import { motion } from 'framer-motion'
import { isSEO, getLocationParams, usePreserveNSBP } from '@/utils'
import _ from 'lodash'
import { loadDataForContainer } from '@services/photo'

const springSettings = { type: 'spring' as const, stiffness: 170, damping: 26 }
const NEXT = 'show-next'

interface QueryParams {
  from?: string
  nsbp?: string | number
}

interface PhotoProps {
  query: QueryParams
  data: [number, number, string][]
  menu: Array<{ name: string; cover?: string; count?: number }>
  getPhotoMenu: (dic: string) => void
}

const Photo = ({ query, data, menu, getPhotoMenu }: PhotoProps) => {
  const location = useLocation()
  let { from } = query
  const { withNSBP } = usePreserveNSBP()
  // 使用 useMemo 缓存 photos，避免每次渲染都创建新数组
  const photos = useMemo(() => (Array.isArray(data) ? data : []), [data])
  const [currPhoto, setCurrPhoto] = useState(0)
  // 使用 ref 来跟踪初始的 dic 值，用于区分首次加载和分类切换
  const initialDicRef = useRef<string | null>(null)

  const [currPhotoData, setCurrPhotoData] = useState<[number, number, string]>(
    photos[0] || [0, 0, '']
  )

  const [currWidth, currHeight] = currPhotoData

  const widths = photos.map((photo) => {
    const [origW, origH] = photo
    return (currHeight / origH) * origW
  })

  // 同步 currPhoto 和 currPhotoData
  useEffect(() => {
    if (photos[currPhoto]) {
      setCurrPhotoData(photos[currPhoto])
    }
  }, [currPhoto, photos])

  const leftStartCoords = widths
    .slice(0, currPhoto)
    .reduce((sum: number, width: number) => sum - width, 0)

  // Calculate position for each photo
  interface PhotoPosition {
    left: number
    height: number
    width: number
  }

  const photoPositions = photos.reduce<PhotoPosition[]>((acc, _item, i) => {
    const prevLeft =
      i === 0 ? leftStartCoords : acc[i - 1].left + acc[i - 1].width
    acc.push({
      left: prevLeft,
      height: currHeight,
      width: widths[i] || 0
    })
    return acc
  }, [])

  // console.log('photoPositions', photoPositions)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrPhoto(Number(e.target.value))
  }

  const clickHandler = (btn: string) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {_.map(menu, (item: { name: string }, index: number) => {
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
              {photoPositions.map((pos, i) => (
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

interface RootState {
  query: QueryParams
  photo: {
    menu: Array<{ name: string; cover?: string; count?: number }>
    data: [number, number, string][]
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    query: state?.query,
    menu: state?.photo?.menu,
    data: state?.photo?.data
  }
}

const mapDispatchToProps = {
  getPhotoMenu: (dic: string) => loadDataForContainer(null, dic)
}

export default connect(mapStateToProps, mapDispatchToProps)(Photo)
