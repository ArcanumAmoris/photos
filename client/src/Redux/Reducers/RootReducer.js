import {combineReducers} from "redux"
import UserReducer from "../Reducers/UserReducer"
import UpdateReducer from "../Reducers/UpdateReducer"
import ClickedPhotoReducer from "./ClickedPhotoReducer"
import MessageReducer from "../Reducers/MessageReducer"
import PhotosReducer from "../Reducers/PhotosReducer"
import StorageReducer from "./StorageReducer"
import DarkThemeReducer from "./DarkThemeReducer"
import LoadingReducer from "./LoadingReducer"

export default combineReducers({
    UserReducer,
    UpdateReducer,
    ClickedPhotoReducer,
    PhotosReducer,
    MessageReducer,
    StorageReducer,
    DarkThemeReducer,
    LoadingReducer
})