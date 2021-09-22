export default function UserReducer(state = null, action) {
    switch(action.type) {
        case "setUser":
            return {...state, 
                username: action.payload.result[0].username,
                userID: action.payload.id
            }
    default:
        return state 
}}
