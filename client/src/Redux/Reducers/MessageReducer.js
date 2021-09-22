const init = {
    message: ""
}


export default function MessageReducer(state = init, action) {
    switch(action.type) {
        case "Message":
            return {
                ...state,
                message: action.payload
            }
    default:
        return state 
}}
