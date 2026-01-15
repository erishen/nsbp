import React, { useState, useEffect } from 'react'
import { Container } from '@styled/component/layout'
import Loading from './Loading'

interface LayoutProps {
  children: React.ReactNode
  query?: { seo?: string | number }
}

const Layout = ({ children, query }: LayoutProps) => {
  let seo: string | number | undefined
  if (query !== undefined && query !== null) {
    seo = query.seo
  }

  const [pageLoad, setPageLoad] = useState(
    seo !== undefined ? parseInt(String(seo), 10) : 0
  )

  useEffect(() => {
    if (pageLoad === 0) {
      setPageLoad(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Container>{pageLoad ? children : <Loading />}</Container>
}

export default Layout
