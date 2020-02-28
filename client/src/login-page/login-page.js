import React, {useState} from 'react'
import axios from 'axios'

import {getFingerprint} from '../utilities'

const LoginPage = () =>{
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    return (
        <div>
            Login Page
            <input 
                type='text'
                placeholder='username'
                onChange={(e)=>{
                    setUsername(e.target.value)
                }
            }/>
            username
            <br/>
            <input 
                type='password'
                placeholder='password'
                onChange={(e)=>{
                    setPassword(e.target.value)
                }
            }/>
            password
            <br/>
            <button
                onClick={async ()=>{
                    console.log('data', username, password)
                    axios('http://localhost:4000', {
                        method: 'post',
                        data: {password, username, t:1, fingerprint: await getFingerprint()}
                    }).then(response=>{
                        console.log(response.data)
                        localStorage.setItem('access', response.data.access )
                        localStorage.setItem('refresh', response.data.refresh )
                        document.location.href='http://localhost:3000/profile'
                    })
                }}
            >
                Отправить Данные
            </button>
        </div>
    )
}

export default LoginPage