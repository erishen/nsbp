import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Container,
  LogoWrapper as Logo,
  Nav,
  NavLink,
  Brand
} from '@styled/component/header'

const Header = () => {
  const location = useLocation()

  return (
    <Container>
      <Brand>
        <Link to="/">
          <Logo>
            <span>N</span>sbp.js
          </Logo>
        </Link>
      </Brand>
      <Nav>
        <Link to="/">
          <NavLink $active={location.pathname === '/'}>🏠 首页</NavLink>
        </Link>
        <Link to="/login">
          <NavLink $active={location.pathname === '/login'}>🔐 登录</NavLink>
        </Link>
        <Link to="/photo">
          <NavLink $active={location.pathname === '/photo'}>🖼️ 图片</NavLink>
        </Link>
      </Nav>
    </Container>
  )
}

export default Header
