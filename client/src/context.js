import React, {createContext, useReducer} from 'react'

import reducer from './reducer'
import asyncDispatch from './asyncDispatch'

const Context = createContext([{}, ()=>{}])

const initState = {
    responseData: null,
    loading: false,
    error: null
}

const ContextProvider = ({children}) =>{
    const [state, dispatch] = useReducer(reducer, initState)
    return(
        <Context.Provider value={[state, asyncDispatch(dispatch)]}>
            {children}
        </Context.Provider>
    )
}

export {
    Context,
    ContextProvider
} 