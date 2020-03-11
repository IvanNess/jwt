const reducer = (state, {type, payload}) =>{
    console.log('reducer payload', payload)
    switch(type){
        case 'RESPONSE':
            return{
                ...state,
                user: payload.responseData.user,
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
            return {
                ...state,
                user: null,
                loading: false,
                error: payload.error
            }
        default: {
                return state
        }
    }
}

export default reducer