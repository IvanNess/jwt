import React, { useState, useContext, useEffect } from 'react'

import { getFingerprint } from '../utilities'
import { Context } from '../context'

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [{ error, loading, responseData }, dispatch] = useContext(Context)
    useEffect(() => {
        console.log(responseData)
        if (responseData === 'Incorrect user or password.') {
            localStorage.setItem('access', responseData.access)
            localStorage.setItem('refresh', responseData.refresh)
            return
        }
        if (!responseData) return
        console.log('after')
        localStorage.setItem('access', responseData.access)
        localStorage.setItem('refresh', responseData.refresh)
        document.location.href = 'http://localhost:3000/profile'
    }, [responseData])
    if (error) return <div>Error: {error}</div>
    if (loading) return <div>Loading...</div>
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
                    dispatch({ type: 'LOGIN', payload: { password, username, t: 1, fingerprint: await getFingerprint() } })

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