export default function ClickedPhotoReducer(state = null, action) {
    switch(action.type) {
        case "SelectedPhoto":
            return action.payload
    default:
        return state 
}}
