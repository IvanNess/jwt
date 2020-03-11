import axios from 'axios'

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
                return dispatch({ type: 'RESPONSE', payload: {responseData: response.data, pathname } })
            }
            catch (err) {
                return dispatch({ type: 'ERROR', payload: err })
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
                return dispatch({ type: 'RESPONSE', payload: {responseData: response.data, pathname: loginPathname } })
            }
            catch (err) {
                return dispatch({ type: 'ERROR', payload: err })
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
                if (response.data.message === 'access denied') {
                    const fingerprint = await getFingerprint()
                    response = await axios('http://localhost:4000/refresh', {
                        method: 'post',
                        data: {
                            refresh: localStorage.getItem('refresh'),
                            fingerprint
                        }
                    })
                    console.log('refresh res', response)
                    if (response.data === 'refresh is out of date or missmatched fingerprint' || response.data === 'refresh is invalid') {
                        document.location.href = `http://localhost:3000/login`
                    } else if (response.data.message && response.data.message === 'refresh is valid and updated') {
                        localStorage.setItem('access', response.data.access)
                        localStorage.setItem('refresh', response.data.refresh)
                    }
                }
                console.log('before async dispatch', payload)
                return dispatch({ type: 'RESPONSE', payload: {responseData: response.data} })
            } catch (err) {
                return dispatch({ type: 'ERROR', payload: err })
            }
        default: {
            return dispatch({ type, payload })
        }
    }
}

export default asyncDispatch