export default function StorageReducer(state = 0, action) {
    switch(action.type) {
        case "SetStorage":
            return action.payload
    default:
        return state 
}}
