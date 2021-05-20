import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../styled/component/header'

const Header = () => {
  return (
    <Container>
      <Link to="/">Home </Link>
      <Link to="/login">Login</Link>
      <Link to="/photo">Photo</Link>
    </Container>
  )
}

export default Header
