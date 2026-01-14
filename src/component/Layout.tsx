import React, { useState, useEffect } from 'react'
import { Container } from '@styled/component/layout'
import Loading from './Loading'

const Layout = ({ children, query }: any) => {
  let seo: any = 0
  if (query !== undefined && query !== null) {
    seo = query.seo
  }

  const [pageLoad, setPageLoad] = useState(
    seo !== undefined ? parseInt(seo, 10) : 0
  )

  useEffect(() => {
    if (pageLoad === 0) {
      setPageLoad(1)
    }
  }, [])

  return <Container>{pageLoad ? children : <Loading />}</Container>
}

export default Layout
