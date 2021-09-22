export default function UpdateReducer(state = false, action) {
    switch(action.type) {
        case "Update":
            return action.payload
    default:
        return state 
}}
