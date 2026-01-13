import React, { Fragment, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import Header from '../component/Header'
import Layout from '../component/Layout'
import { Helmet } from 'react-helmet'
import { Container, Row } from '../styled/photo'
import { motion } from 'framer-motion'
import { isSEO, getLocationParams } from '../utils'
import { useCurrentFlag } from '../utils/clientConfig'
import _ from 'lodash'
import { loadData } from '../services/photo'

const springSettings = { type: "spring", stiffness: 170, damping: 26 }
const NEXT = 'show-next'

const Photo = ({ query, data, menu, getPhotoMenu }: any) => {
  const location = useLocation()
  let { dic, from } = query
  const photos = Array.isArray(data) ? data : []
  const [currPhoto, setCurrPhoto] = useState(0)

  const [currPhotoData, setCurrPhotoData] = useState(photos[0] || [0, 0, ''])

  const [currWidth, currHeight] = currPhotoData

  const widths = photos.map(([origW, origH]:any) => (currHeight / origH) * origW)

  // 同步 currPhoto 和 currPhotoData
  useEffect(() => {
    if (photos[currPhoto]) {
      setCurrPhotoData(photos[currPhoto])
    }
  }, [currPhoto, photos])

  const leftStartCoords = widths
    .slice(0, currPhoto)
    .reduce((sum:any, width:any) => sum - width, 0)

  // Calculate position for each photo
  const photoPositions = photos.reduce((acc:any, [origW, origH]:any, i:any, arr:any) => {
    const prevLeft = i === 0 ? leftStartCoords : acc[i-1].left + acc[i-1].width
    acc.push({
      left: prevLeft,
      height: currHeight,
      width: widths[i] || 0
    })
    return acc
  }, [])

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
    const currentDic = getLocationParams('dic')

    const doGetPhotoMenu = () => {
      getPhotoMenu(currentDic)
    }

    if (!isSEO()) {
      doGetPhotoMenu()
    } else {
      if (from === 'link') {
        doGetPhotoMenu()
      }
    }

    // 重置到第一张
    setCurrPhoto(0)
  }, [location?.search])

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
          {
            _.map(menu, (item:any, index:number) => {
              return (
                <Link key={`menu${index}`} to={`/photo?dic=${item.name}`}>{item.name}</Link>
              )
            })
          }
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
                  src={photos[i][2] ? (useCurrentFlag ? `/images/${photos[i][2]}` : photos[i][2]) : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}
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
    dispatch(loadData(null, dic))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Photo)
