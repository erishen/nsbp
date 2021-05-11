import React, { Fragment, useEffect, useState } from 'react'
import Header from '../component/Header'
import Loading from '../component/Loading'
import { connect } from 'react-redux'
import axios from 'axios'
import { GITHUB_ZEITNEXT_GET } from '../store/constants'
import { isSEO } from '../utils'
import { Helmet } from 'react-helmet'

const Home = ({ name, data, query, getGithubZeitNext }: any) => {
  let { seo } = query
  const [pageLoad, setPageLoad] = useState(
    seo !== undefined ? parseInt(seo, 10) : 0
  )
  console.log('pageLoad', query, pageLoad)

  useEffect(() => {
    if (!isSEO()) {
      getGithubZeitNext()
    }

    if (pageLoad === 0) {
      setPageLoad(1)
    }
  }, [])

  return (
    <>
      {pageLoad ? (
        <Fragment>
          <Helmet>
            <title>Home</title>
            <meta name="description" content="Home Description" />
          </Helmet>
          <Header />
          <div>{name}</div>
          <div>
            <p>{data?.description || data?.message}</p>
          </div>
          <button
            onClick={() => {
              alert('click')
            }}
          >
            click
          </button>
        </Fragment>
      ) : (
        <Loading />
      )}
    </>
  )
}

Home.loadData = (resolve: any) => {
  return getData(resolve)
}

const getData = (callback: any = null) => {
  console.log('getData')

  return (dispatch: any) => {
    axios
      .get('https://api.apiopen.top/getJoke?page=1&count=2&type=video')
      .then((res) => {
        // console.log('res', res)
        dispatch({
          type: GITHUB_ZEITNEXT_GET,
          data: res?.data
        })

        callback && callback()
      })
      .catch((e) => {
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
  console.log('mapStateToProps_state', state)
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
