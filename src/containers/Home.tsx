import React, { Fragment, useEffect, useState } from 'react'
import Header from '../component/Header'
import Layout from '../component/Layout'
import { connect } from 'react-redux'
import { GITHUB_ZEITNEXT_GET } from '../store/constants'
import { isSEO } from '../utils'
import { Helmet } from 'react-helmet'
import { Motion, spring } from 'react-motion'
import { Container } from '../styled/home'
import { doGet } from '../utils/fetch'

const Home = ({ name, data, query, getGithubZeitNext }: any) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isSEO()) {
      getGithubZeitNext()
    }
  }, [])
  
  const handleMouseDown = () => {
    setOpen(!open)
  }

  const handleTouchStart = (e: any) => {
    e.preventDefault()
    handleMouseDown()
  }

  return (
    <>
      <Fragment>
        <Helmet>
          <title>Home</title>
          <meta name="description" content="Home Description" />
        </Helmet>

        <Header />

        <Layout query={query}>
          <div>{name}</div>

          <div>
            <p>{data?.description || data?.message}</p>
          </div>

          <div>
            <button
              onClick={() => {
                alert('click')
              }}
            >
              click
            </button>
          </div>

          <div>
            <button
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              Toggle
            </button>
          </div>

          <Container>
            <Motion style={{ x: spring(open ? 400 : 0) }}>
              {({ x }) => (
                // children is a callback which should accept the current value of
                // `style`
                <div className="demo0">
                  <div
                    className="demo0-block"
                    style={{
                      WebkitTransform: `translate3d(${x}px, 0, 0)`,
                      transform: `translate3d(${x}px, 0, 0)`
                    }}
                  />
                </div>
              )}
            </Motion>
          </Container>
        </Layout>
      </Fragment>
    </>
  )
}

Home.loadData = (resolve: any) => {
  return getData(resolve)
}

const getData = (callback: any = null) => {
  console.log('getData')

  return (dispatch: any) => {
    doGet('https://api.apiopen.top/getJoke?page=1&count=2&type=video')
      .then((res:any) => {
        // console.log('res', res)
        dispatch({
          type: GITHUB_ZEITNEXT_GET,
          data: res?.data
        })

        callback && callback()
      })
      .catch((e:any) => {
        // console.log('e', e.response)
        dispatch({
          type: GITHUB_ZEITNEXT_GET,
          data: e?.response?.data
        })

        callback && callback()
      })
  }
}

const mapStateToProps = (state: any) => {
  console.info('mapStateToProps_state', state)
  return {
    name: state?.name,
    query: state?.query,
    data: state?.home?.data
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  getGithubZeitNext() {
    console.log('getGithubZeitNext')
    dispatch(getData())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
