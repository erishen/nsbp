import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../styled/component/header'
import { handleLink } from '../utils'

const Header = () => {
  return (
    <Container>
      <Link to={handleLink("/")}>Home </Link>
      <Link to={handleLink("/login")}>Login</Link>
      <Link to={handleLink("/photo")}>Photo</Link>
    </Container>
  )
}

export default Header
