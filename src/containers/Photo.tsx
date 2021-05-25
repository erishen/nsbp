import React, { Fragment, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Header from '../component/Header'
import Layout from '../component/Layout'
import { Helmet } from 'react-helmet'
import { Container, Row } from '../styled/photo'
import { Motion, spring } from 'react-motion'
import { isSEO, getLocationParams, handleLink } from '../utils'
import { doGet } from '../utils/fetch'
import { GET_PHOTO_MENU, GET_PHOTO_WIDTH_HEIGHT } from '../store/constants'
import { useCurrentFlag } from '../utils/config'
import _ from 'lodash'

const springSettings = { stiffness: 170, damping: 26 }
const NEXT = 'show-next'

const Photo = ({ query, data, menu, getPhotoMenu }: any) => {
  let { dic } = query
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
    const doGetPhotoMenu = () => {
      if (!dic) {
        dic = getLocationParams('dic')
      }
      getPhotoMenu(dic)
    }

    if (!isSEO()) {
      doGetPhotoMenu()
    } else {
      if (Object.keys(menu).length === 0) {
        doGetPhotoMenu()
      }
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
          <Row>
          {
            _.map(menu, (item:any, index:number) => {
              return (
                <a key={`menu${index}`} href={handleLink(`/photo?dic=${item}`)}>{item}</a>
              )
            })
          }
          </Row>
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

const getPhotoWH = (dispatch: any, callback: any, dic='') => {
  let action = 'getPhotoWH'
  if (dic) {
    action += `?dic=${dic}`
  }

  doGet(action)
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

const getPhotoMenu = (dispatch:any, callback:any) => {
  doGet('getPhotoMenu')
      .then((res:any) => {
        // console.log('getPhotoMenu_res', res)
        const { data } = res
        dispatch({
          type: GET_PHOTO_MENU,
          menu: data
        })

        callback && callback(data)
      })
      .catch((e:any) => {
        console.log('getPhotoMenu_e', e)
        callback && callback()
      })
}

const getData = (callback: any = null, dic='') => {
  return (dispatch: any) => {

    if (dic) {
      getPhotoMenu(dispatch, () => {
        getPhotoWH(dispatch, callback, dic)
      })
    } else {
      getPhotoMenu(dispatch, (data:any) => {
        if (data && data.length > 0) {
          getPhotoWH(dispatch, callback, data[0])
        }
      })
    }
  }
}

const mapStateToProps = (state: any) => {
  console.info('mapStateToProps_state', state)
  return {
    query: state?.query,
    menu: state?.photo?.menu,
    data: state?.photo?.data
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  getPhotoMenu(dic:any) {
    dispatch(getData(null, dic))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Photo)
