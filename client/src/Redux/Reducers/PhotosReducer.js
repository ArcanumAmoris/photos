export default function PhotosReducer(state = [], action) {
    switch(action.type) {
        case "SetPhotos":
            return {...state, photos: action.payload}
    default:
        return state 
}}
