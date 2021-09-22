import React, { useCallback, useEffect } from 'react'
import "./Photo.css"
import { useSelector } from 'react-redux'
import trash from "../../Images/trash.png"
import arrow from "../../Images/arrow.png"
import share from "../../Images/share.png"
import axios from 'axios'
import store from '../../../Redux/Store/Store'
import { AddToFavorites, GetPhotos, Message, SetPhoto, Update } from '../../../Redux/Actions/Actions'
import history from '../../../history'

function Photo() {
    const message = useSelector(state => state.MessageReducer.message)
    let {id, favorite, photoKey} = useSelector(state => state.ClickedPhotoReducer)
    const photosArray = useSelector(state => state.PhotosReducer.photos)
    const update = useSelector(state => state.UpdateReducer)

    useEffect(() => {
        return () => {
            store.dispatch(GetPhotos())
        }
    }, [update])

    function setFillColor() {
        return favorite === 1 ? "white" : "black"
    }

    async function AddToTrash() {
        const response = await axios.post("http://localhost:3001/add_to_trash", {id})
        if (response.data) {
            store.dispatch(Update())
            NextPhoto("Your photo has been moved to trash", +1)
    }}

    const NextPhoto = useCallback((message, direction) => {
        const photoIndex = photosArray.findIndex(index => index.id === id)
        if (photosArray[photoIndex+direction] === undefined) {
            history.push("/")
            return
        }
        const photo = photosArray[photoIndex+direction]
        store.dispatch(SetPhoto(photo))
        store.dispatch(Message(message))
    }, [photosArray, id])

    const listen = useCallback((e) => {
        switch (e.key) {
            case "ArrowRight":
                NextPhoto("", +1)
                break
            case "ArrowLeft":
                NextPhoto("", -1)
                break
            default:
                return
        }
    }, [NextPhoto])

    useEffect(() => {
        document.addEventListener("keydown", listen)
        return () => {
            document.removeEventListener("keydown", listen)
        }
    }, [id, listen])

    return (
        <div className="photo-main">
             <div className="photo-icons">
                 <div className="photo_arrow_back" onClick={() => history.goBack()}>
                     <img src={arrow} alt="arrow" />
                 </div>
                 <div>
                    <img src={share} alt="share" />
                    <img src={trash} alt="trash" onClick={AddToTrash}/>
                    <svg onClick={() =>  store.dispatch(AddToFavorites(id, favorite, photoKey))} id="favorite-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={setFillColor()} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                 </div>
            
            </div> 
            <div className="photo-display">
                <img src={`${process.env.REACT_APP_cloudfrontURL + photoKey}`} alt="pic" className="selected-photo"/>
            </div>
            {message && <div className="message">{message}</div>}
        </div>
    )
}

export default Photo
