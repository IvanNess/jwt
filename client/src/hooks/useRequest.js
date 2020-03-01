import React, { useState } from 'react'
import axios from 'axios'

const useRequest = url => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState(null)

    const setRequest = async (options) => {
        setLoading(true)
        try{
            const response = await axios(url, options)
            setLoading(false)
            setError(null)
            setResponse(response)
        } catch(err){
            setError(err)
        }
    }

    return [{ error, loading, response }, setRequest]
}

export default useRequest