import React, {useContext, useEffect} from 'react'

import {Context} from '../context'


const ProfilePage = () => {
    const [{error, loading, responseData, user}, dispatch] = useContext(Context)
    console.log('profile page', responseData, user)
    console.log('profile page localstorage', localStorage)
    useEffect(()=>{
        //console.log(responseData)
        const pathname = responseData && responseData.pathname || window.location.pathname
        dispatch({type:'GET_PROFILE', payload: {pathname}})
    }, [])
    // useEffect(()=>{
    //     dispatch({type:'GET_PROFILE'})
    // }, [responseData])
    if (error) return <div>Error: {error}</div>
    if (loading || !user) return <div>Loading...</div>

    return (
        <div>
            ProfilePage
        </div>
    )
}

export default ProfilePage