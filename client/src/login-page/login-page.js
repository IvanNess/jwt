import React, { useState, useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import { getFingerprint } from '../utilities'
import { Context } from '../context'

import './login-page.css'
import loginImage from './login-image.png'

const LoginPage = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [{ error, loading, responseData, user }, dispatch] = useContext(Context)
    console.log('login page props', props)
    // useEffect( () => {
    //     console.log(responseData)
    //     if (responseData === 'Incorrect user or password.') {
    //         localStorage.setItem('access', responseData.access)
    //         localStorage.setItem('refresh', responseData.refresh)
    //         return
    //     }
    //     if (!responseData) 
    //         return
    //     console.log('after')
    //     localStorage.setItem('access', responseData.access)
    //     localStorage.setItem('refresh', responseData.refresh)
    //     setRedirect(true)
    // }, [responseData])
    useEffect(() => {
        if (!user) {
            dispatch({ type: 'GET_PROFILE', payload: { fromLoginPage: true } })
        }
    }, [])
    const search = document.location.search
    const redirectUrlArr =search.match(/^\?redirectUrl=(\S*)$/)
    const redirectUrl = redirectUrlArr? redirectUrlArr[1]: '/profile'
    console.log('redirectUrl', redirectUrl)
    console.log('response data', responseData)
    console.log('user', user)
    console.log('error', error)
    if(user){
        return <Redirect to={redirectUrl} />
    }
    if (error && error!=='No user yet.') return <div>Error: {error}</div>
    if (!user && !error || loading) return <div>Loading....</div>
    //if (user) return <Redirect to='/profile' />

    // if (responseData === 'No user yet.') {
    //     console.log('no user yet.')
    // } else if (responseData === 'Incorrect user or password.') {
    //     localStorage.setItem('access', responseData.access)
    //     localStorage.setItem('refresh', responseData.refresh)
    // } else if (responseData) {
    //     console.log('after', responseData)
    //     if (responseData.message !== 'access allowed') {
    //         localStorage.setItem('access', responseData.access)
    //         localStorage.setItem('refresh', responseData.refresh)
    //     }
    //     return <Redirect to={redirectUrl} />
    // } else if (!responseData) {
    //     console.log('no response data')
    //     return <div>Loading....</div>
    // }

    return (
        <div>
            Login Page
            <input
                className='login-page-username'
                type='text'
                placeholder='username'
                onChange={(e) => {
                    setUsername(e.target.value)
                }
                } />
            username
            <br />
            <input
                type='password'
                placeholder='password'
                onChange={(e) => {
                    setPassword(e.target.value)
                }
                } />
            password
            <br />
            <button
                className='login-page-button'
                onClick={async () => {
                    const pathname = responseData && responseData.pathname || window.location.pathname
                    dispatch({ type: 'LOGIN', payload: { password, username, pathname: pathname ? pathname : null, fingerprint: await getFingerprint() } })

                    // console.log('data', username, password)
                    // axios('http://localhost:4000', {
                    //     method: 'post',
                    //     data: {password, username, t:1, fingerprint: await getFingerprint()}
                    // }).then(response=>{
                    //     console.log(response.data)
                    //     localStorage.setItem('access', response.data.access )
                    //     localStorage.setItem('refresh', response.data.refresh )
                    //     document.location.href='http://localhost:3000/profile'
                    // })
                }}
            >
                Отправить Данные
            </button>
            <div className='login-page-div'>
                <img className='login-page-image' src={loginImage}/>
            </div>
        </div>
    )
}

export default LoginPage