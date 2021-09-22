export default function StorageReducer(state = "", action) {
    switch(action.type) {
        case "SetStorage":
            return action.payload
    default:
        return state 
}}
