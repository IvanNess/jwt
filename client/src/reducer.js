const reducer = (state, {type, payload}) =>{
    switch(type){
        case 'RESPONSE':
            return{
                ...state,
                responseData: payload,
                loading: false,
                error: null
            }
        case 'LOADING':
            return{
                ...state,
                responseData: null,
                loading: true,
                error: null
            }
        case 'ERROR':
            return {
                ...state,
                responseData: null,
                loading: false,
                error: payload.error
            }
        default: {
                return state
        }
    }
}

export default reducer