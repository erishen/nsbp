import React, { Fragment, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Header from '../component/Header'
import Layout from '../component/Layout'
import { Helmet } from 'react-helmet'
import { Container, Row } from '../styled/photo'
import { Motion, spring } from 'react-motion'
import { isSEO } from '../utils'
import { doGet } from '../utils/fetch'
import { GET_PHOTO_WIDTH_HEIGHT } from '../store/constants'
import { useCurrentFlag } from '../utils/config'

const springSettings = { stiffness: 170, damping: 26 }
const NEXT = 'show-next'

const Photo = ({ query, data, getPhotoWH }: any) => {
  const photos = data
  const [currPhoto, setCurrPhoto] = useState(0)

  const [currWidth, currHeight] = photos[currPhoto]

  const widths = photos.map(([origW, origH]:any) => (currHeight / origH) * origW)

  const leftStartCoords = widths
    .slice(0, currPhoto)
    .reduce((sum:any, width:any) => sum - width, 0)

  let configs: any = []
  photos.reduce((prevLeft:any, [origW, origH]:any, i:any) => {
    configs.push({
      left: spring(prevLeft, springSettings),
      height: spring(currHeight, springSettings),
      width: spring(widths[i] || 0, springSettings)
    })
    return prevLeft + widths[i]
  }, leftStartCoords)

  // console.log('configs', configs)

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
    if (!isSEO()) {
      getPhotoWH()
    }
  }, [])
  
  return (
    <Fragment>
      <Helmet>
        <title>Photo</title>
        <meta name="description" content="Photo Description" />
      </Helmet>
      <Header />

      <Layout query={query}>
        <Container>
          <div>Scroll Me</div>
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
            <Motion
              style={{ height: spring(currHeight), width: spring(currWidth) }}
            >
              {(container) => (
                <div className="demo4-inner" style={container}>
                  {configs.map((style: any, i: any) => (
                    <Motion key={i} style={style}>
                      {(style) => (
                        <img
                          className="demo4-photo"
                          src={useCurrentFlag ? `/images/${photos[i][2]}` : photos[i][2] }
                          style={style}
                        />
                      )}
                    </Motion>
                  ))}
                </div>
              )}
            </Motion>
          </div>
        </Container>
      </Layout>
    </Fragment>
  )
}

Photo.loadData = (resolve: any) => {
  return getData(resolve)
}

const getData = (callback: any = null) => {
  return (dispatch: any) => {
    doGet('getPhotoWH')
      .then((res:any) => {
        // console.log('getPhotoWH_res', res)
        dispatch({
          type: GET_PHOTO_WIDTH_HEIGHT,
          data: res?.data
        })
        callback && callback()
      })
      .catch((e:any) => {
        console.log('getPhotoWH_e', e)
        callback && callback()
      })
  }
}

const mapStateToProps = (state: any) => {
  console.info('mapStateToProps_state', state)
  return {
    query: state?.query,
    data: state?.photo?.data
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  getPhotoWH() {
    dispatch(getData())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Photo)
