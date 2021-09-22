export default function DarkThemeReducer(state = false, action) {
    switch(action.type) {
        case "SetTheme":
            return action.payload
    default:
        return state 
}}
