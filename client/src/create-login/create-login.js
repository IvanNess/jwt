import React, { useState, useEffect, useContext } from 'react'
import {Redirect} from 'react-router-dom'

import { getFingerprint } from '../utilities'
import {Context} from '../context'

const CreateLogin = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [{ error, loading, responseData, user }, dispatch] = useContext(Context)
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
                    dispatch({type: 'CREATE', payload: { password, username, fingerprint } })
                }}
            >
                Отправить Данные
            </button>
        </div>
    )
}

export default CreateLogin