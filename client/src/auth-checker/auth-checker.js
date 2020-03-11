import React, { useContext, useEffect } from 'react'
import { Context } from '../context'
import { Redirect } from 'react-router-dom'

const AuthChecker = ({ children }) => {
    const [{ user }, dispatch] = useContext(Context)
    const pathname = window.location.pathname
    console.log('auth-checker', pathname)
    let returnDiv = (
        <div>
            {children}
        </div>
    )
    const regexarr = [
        [/^\/login\/?$/, ()=>{console.log('login')}],
        [/^\/create\/?$/, ()=>{console.log('create')}],
        [/^\/user(\/\w*)?$/, ()=>{console.log('user')}]
    ]
    const regex = regexarr.find(([re, cb]) => {
        console.log(pathname.match(re))
        if (pathname.match(re) !== null) {
            cb()
            return true
        }
        return false
    })
    if (!regex)
        return <Redirect to='/login'/>

    // useEffect(() => {
    //     const reg = /\/login/
    //     console.log('reg', pathname)
    //     switch (pathname) {
    //         case '/login':
    //         case '/login/':
    //             console.log('login')
    //             break
    //         case '/create':
    //         case '/create/':
    //             console.log('create')
    //             break
    //         default:
    //             if (!user) {
    //                 dispatch({ type: 'GET_PROFILE', payload: { pathname } })
    //             }
    //     }
    // }, [])


    return (<div>{returnDiv}</div>)
}

export default AuthChecker