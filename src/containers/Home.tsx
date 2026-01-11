import React, { Fragment, useEffect, useState } from 'react'
import Header from '../component/Header'
import Layout from '../component/Layout'
import { connect } from 'react-redux'
import { isSEO, getLocationParams } from '../utils'
import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'
import { Container } from '../styled/home'
import { loadData } from '../services/home'

const Home = ({ name, data, query, getGithubZeitNext }: any) => {
  let { from } = query
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isSEO()) {
      getGithubZeitNext()
    } else {
      if (!from) {
        from = getLocationParams('from')
      }

      if(from === 'link'){
        getGithubZeitNext()
      }
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
            {
              data?.result?.map((item:any, index:number)=>{
                return (
                  <p key={'item'+index}>{(index+1) + '. ' + item?.text}</p>
                )
              })
            }
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

          <br/>

          <div>
            <button
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              Toggle
            </button>
          </div>

          <Container>
            <div className="demo0">
              <motion.div
                className="demo0-block"
                animate={{ x: open ? 400 : 0 }}
                transition={{ type: "spring", stiffness: 170, damping: 26 }}
              />
            </div>
          </Container>
        </Layout>
      </Fragment>
    </>
  )
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
    dispatch(loadData())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
