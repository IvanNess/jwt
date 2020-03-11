import React, { useContext, useEffect } from 'react'

import { Context } from '../context'

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