import axios from "axios";
import store from "../Store/Store";

export function Message(message) {
    store.dispatch({type: "Message", payload: message})
    return () => {
        const timer = setTimeout(() => {
            store.dispatch({type: "Message", payload: ""})
        }, 6000)
        return () => clearTimeout(timer)
}}

export function GetPhotos() { 
    return async dispatch => {
        try {
            const photos = await axios.post(`${process.env.REACT_APP_backend_url}/getphotos`, {}, {withCredentials: true})
            if (photos.data) {
                store.dispatch({type: "SetLoading", payload: false})
                store.dispatch({type: "SetPhotos", payload: photos.data})
            }
        } catch (error) {
            console.log(error)
        }
}}

export function SetPhoto(photo) {
    return async dispatch => {
        await store.dispatch({type: "SelectedPhoto", payload: photo})
}}

export function Update() {
    const update = store.getState().UpdateReducer
    return store.dispatch({type: "Update", payload: !update})   
}

export function AddToFavorites(id, favorite, photoKey) {
    return async dispatch => {
        const response = await axios.post(`${process.env.REACT_APP_backend_url}/favorite`, {id})
        if (response.data) {
            store.dispatch(Update())
            favorite === 1 ? favorite = 0 : favorite = 1
            const photo = {id, favorite, photoKey}
            store.dispatch(SetPhoto(photo)) 
}}} 


