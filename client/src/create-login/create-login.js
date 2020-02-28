import React, { useState } from 'react'
import axios from 'axios'

import { getFingerprint } from '../utilities'

const CreateLogin = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
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
                    console.log('create')
                    console.log('data', username, password)
                    const fingerprint = await getFingerprint()
                    console.log('fingerprint')
                    console.log('fingerprint', fingerprint)
                    axios('http://localhost:4000/create', {
                        method: 'post',
                        data: { password, username, t: 1, fingerprint }
                    }).then(res => {
                        console.log(res.data)
                        if (res.data === 'Username is not available. Lets try another name.') {
                            return
                        }
                        localStorage.setItem('access', res.data.access)
                        localStorage.setItem('refresh', res.data.refresh)
                        document.location.href = 'http://localhost:3000/profile'
                    })
                }}
            >
                Отправить Данные
            </button>
        </div>
    )
}

export default CreateLogin