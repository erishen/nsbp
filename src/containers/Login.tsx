import React, { Fragment } from 'react'
import Header from '../component/Header'
import { Helmet } from 'react-helmet'
import '../css/test.css'
import '../css/test.less'
import '../css/test2.sass'
import '../css/test3.scss'
import { Container } from '../styled/test'

const Login = ()=>{
    return (
        <Fragment>
            <Helmet>
                <title>Login</title>
                <meta name="description" content="Login Description"/>
            </Helmet>
            <Header />
            <Container>
                <p>login</p>
                <div className="testBox"></div>
                <div className="testBox1"></div>
                <div className="testBox2"></div>
                <div className="testBox3"></div>
            </Container>
        </Fragment>
    )
}

export default Login