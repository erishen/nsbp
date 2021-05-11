import React, { Fragment } from 'react'
import Header from '../component/Header'
import { Helmet } from 'react-helmet'

const Login = ()=>{
    return (
        <Fragment>
            <Helmet>
                <title>Login</title>
                <meta name="description" content="Login Description"/>
            </Helmet>
            <Header/>
            <div>login</div>
        </Fragment>
    )
}

export default Login