import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Context } from './context'
import * as R from 'ramda'

const MyRouter = props => {
    const [{ Loading, error, user }, dispatch] = useContext(Context)

    console.log('my route', props)
    console.log('my route user', user)


    const role = props && props.role
    console.log('role', role)
    if (!role || (user && R.includes(user.role, role))){
        console.log('here')
        return (
            <Route {...props} />
        )
    }
    return <Redirect to='/profile'/>
}

export default MyRouter