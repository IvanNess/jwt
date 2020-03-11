import React, { useState, useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import { getFingerprint } from '../utilities'
import { Context } from '../context'

const LoginPage = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)
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

    if (responseData === 'No user yet.') {
        console.log('no user yet.')
    } else if (responseData === 'Incorrect user or password.') {
        localStorage.setItem('access', responseData.access)
        localStorage.setItem('refresh', responseData.refresh)
    } else if (responseData) {
        console.log('after', responseData)
        if (responseData.message !== 'access allowed') {
            localStorage.setItem('access', responseData.access)
            localStorage.setItem('refresh', responseData.refresh)
        }
        const originPath = sessionStorage.getItem('originPath') ? sessionStorage.getItem('originPath') : '/profile'
        return <Redirect to={originPath} />
    } else if (!responseData) {
        console.log('no response data')
        return <div>Loading....</div>
    }

    if (error) return <div>Error: {error}</div>
    if (loading) return <div>Loading....</div>
    if (user) return <Redirect to='/profile' />

    return (
        <div>
            Login Page
            <input
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
        </div>
    )
}

export default LoginPage