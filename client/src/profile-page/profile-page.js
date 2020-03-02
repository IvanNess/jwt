import React, {useContext, useEffect} from 'react'

import {Context} from '../context'


const ProfilePage = () => {
    const [{error, loading, responseData}, dispatch] = useContext(Context)
    console.log('profile page', responseData)
    useEffect(()=>{
        //console.log(responseData)
        dispatch({type:'GET_PROFILE'})
    }, [])
    // useEffect(()=>{
    //     dispatch({type:'GET_PROFILE'})
    // }, [responseData])
    if (error) return <div>Error: {error}</div>
    if (loading) return <div>Loading...</div>

    // axios('http://localhost:4000/profile', {
    //     method: 'post',
    //     data: {
    //         access: localStorage.getItem('access'),
    //     }
    // }).then(async (res, rej) =>{
    //     console.log(res)
    //     if(rej || res.data==='access denied'){
    //         const fingerprint = await getFingerprint()
    //         axios('http://localhost:4000/refresh', {
    //             method: 'post',
    //             data: {
    //                 refresh: localStorage.getItem('refresh'),
    //                 fingerprint
    //             }
    //         }).then((res, rej)=>{
    //             console.log('refresh res', res, rej)
    //             if(rej || res.data === 'refresh is out of date or missmatched fingerprint' || res.data === 'refresh is invalid'){
    //                 document.location.href='http://localhost:3000/login'
    //             } else if(res.data.message && res.data.message === 'refresh is valid and updated'){
    //                 localStorage.setItem('access', res.data.access)
    //                 localStorage.setItem('refresh', res.data.refresh)
    //             }
    //         })
    //     }
    // })

    return (
        <div>
            ProfilePage
        </div>
    )
}

export default ProfilePage