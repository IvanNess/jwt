import React, { useContext, useEffect } from 'react'
import * as R from 'ramda'

import { Context } from '../context'
import { Redirect } from 'react-router-dom'

const withAuth = Wrapped => ( props ) => {
    const [{ user, loading, error }, dispatch] = useContext(Context)
    console.log('header props', props)
    console.log('with auth user', user)
    useEffect(() => {
        console.log('with auth use effect')
        if (!user) {
            sessionStorage.setItem('originPath', props.match.url)
            dispatch({ type: 'GET_PROFILE'})
        }
    }, [])
    if (error)
        return <div>Error...{error}</div>
    if (loading || !user)
        return <div>Loading...</div>
    if (!user.role || !R.includes('user', user.role)){
        sessionStorage.removeItem('originPath')
        return <Redirect to='/noauth'/>
    }
    sessionStorage.removeItem('originPath')

    return (
        <Wrapped {...props} />
    )
}

const Header = () => {
    const userReg = /\/user\/(\w+)/
    const pathname = window.location.pathname
    const match = pathname.match(userReg)
    const slug = match ? match[1] : null

    return (
        <div>
            Header {slug}
        </div>
    )
}

export default withAuth(Header)