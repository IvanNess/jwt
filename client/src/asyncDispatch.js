import axios from 'axios'
import * as R from 'ramda'

import { getFingerprint } from './utilities'

const asyncDispatch = dispatch => async ({ type, payload }) => {
    console.log('async dispatch', payload)
    let response;
    switch (type) {
        case 'CREATE':
            const { password, username, fingerprint, pathname } = payload
            dispatch({ type: 'LOADING' })
            try {
                response = await axios('http://localhost:4000/create', {
                    method: 'post',
                    data: { password, username, fingerprint }
                })
                console.log('async dispatch response', response)
                localStorage.setItem('access', response.data.access)
                localStorage.setItem('refresh', response.data.refresh)
                return dispatch({ type: 'RESPONSE', payload: { responseData: response.data, pathname } })
            }
            catch (err) {
                return dispatch({ type: 'ERROR', payload: err.response.data })
            }
        case 'LOGIN':
            const { password: loginPassword, username: loginUsername, fingerprint: loginFingerprint, pathname: loginPathname } = payload
            dispatch({ type: 'LOADING' })
            try {
                response = await axios('http://localhost:4000', {
                    method: 'post',
                    data: { password: loginPassword, username: loginUsername, fingerprint: loginFingerprint }
                })
                console.log('async dispatch response', response)
                localStorage.setItem('access', response.data.access)
                localStorage.setItem('refresh', response.data.refresh)
                return dispatch({ type: 'RESPONSE', payload: { responseData: response.data } })
            }
            catch (err) {
                console.log('login error', err.response.data)
                return dispatch({ type: 'ERROR', payload: err.response.data })
            }
        case 'GET_PROFILE':
            dispatch({ type: 'LOADING' })
            try {
                console.log('access from localstorage', localStorage.getItem('access'))
                response = await axios('http://localhost:4000/profile', {
                    method: 'post',
                    data: {
                        access: localStorage.getItem('access'),
                    }
                })
                console.log('async dispatch response', response)
                console.log('before async dispatch', payload)
                return dispatch({ type: 'RESPONSE', payload: { responseData: response.data } })
            } catch (err) {
                if (err.response.status === 401) {
                    const fingerprint = await getFingerprint()
                    try {
                        response = await axios('http://localhost:4000/refresh', {
                            method: 'post',
                            data: {
                                refresh: localStorage.getItem('refresh'),
                                fingerprint
                            }
                        })
                        console.log('refresh res', response)
                        if (response.data.message && response.data.message === 'refresh is valid and updated') {
                            localStorage.setItem('access', response.data.access)
                            localStorage.setItem('refresh', response.data.refresh)
                            return dispatch({ type: 'RESPONSE', payload: { responseData: response.data } })
                        }
                    } catch (err) {
                        console.log('error response', err.response)
                        if (err.response.status === 401) {
                            if (payload && payload.originPath) {
                                document.location.href = `http://localhost:3000/login?redirectUrl=${payload.originPath}`
                            } else {
                                return dispatch({ type: 'ERROR', payload: 'No user yet.' })
                            }
                            // if (R.prop('fromLoginPage', payload)) {
                            //     return dispatch({ type: 'RESPONSE', payload: { responseData: 'No user yet.' } })
                            // } else {
                            //     document.location.href = `http://localhost:3000/login`
                            // }
                        }
                    }
                    console.log('refresh res', response)
                }

            }
        default: {
            return dispatch({ type, payload })
        }
    }
}

export default asyncDispatch