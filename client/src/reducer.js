const reducer = (state, {type, payload}) =>{
    console.log('reducer payload', payload)
    switch(type){
        case 'RESPONSE':
            return{
                ...state,
                user: payload.responseData.user? payload.responseData.user: state.user, 
                responseData: payload.responseData,
                loading: false,
                error: null
            }
        case 'LOADING':
            return{
                ...state,
                loading: true,
                error: null
            }
        case 'ERROR':
            console.log('reducer error', payload)
            return {
                ...state,
                user: null,
                loading: false,
                error: payload
            }
        default: {
                return state
        }
    }
}

export default reducer