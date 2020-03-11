import React, { useState, useEffect, useContext } from 'react'

import { getFingerprint } from '../utilities'
import {Context} from '../context'

const CreateLogin = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [{error, loading, responseData}, dispatch] = useContext(Context)
    console.log('create page')
    useEffect(() => {
        if(!responseData) return
        if (responseData === 'Incorrect user or password.') {
            return console.log('Incorrect user or password.')
        }
        console.log('create-login response data', responseData)
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
                    const fingerprint = await getFingerprint()
                    const pathname = responseData.pathname || window.location.pathname
                    dispatch({type: 'CREATE', payload: { password, username, fingerprint, pathname } })
                }}
            >
                Отправить Данные
            </button>
        </div>
    )
}

export default CreateLogin