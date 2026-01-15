import React from 'react'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle, theme2 } from '@styled/common'

interface ThemeProps {
  children: React.ReactNode
}

const Theme = ({ children }: ThemeProps) => {
  return (
    <>
      <GlobalStyle whiteColor={true} />
      <ThemeProvider theme={theme2}>{children}</ThemeProvider>
    </>
  )
}

export default Theme
