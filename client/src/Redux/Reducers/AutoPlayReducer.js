export default function AutoPlayReducer(state = false, action) {
    switch(action.type) {
        case "SetAutoPlay":
            return action.payload
    default:
        return state 
}}
