import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import trash from "../../../Images/trash.png"
import arrow from "../../../Images/arrow.png"
import share from "../../../Images/share.png"
import axios from 'axios'
import store from '../../../../Redux/Store/Store'
import { AddToFavorites, Message, SetPhoto } from '../../../../Redux/Actions/Actions'
import history from '../../../../history'

function ClickedFavorite(props) {
    const didMount = useRef(false)
    const [favPhotos, setFavPhotos] = useState()
    const message = useSelector(state => state.MessageReducer.message)
    let {id, favorite, photoKey} = useSelector(state => state.ClickedPhotoReducer)
    const update = useSelector(state => state.UpdateReducer)

    const GetFavPhotos = useCallback(async() => {
        const userID = localStorage.getItem("userID")
        const response = await axios.post(`${process.env.REACT_APP_backend_url}/get_fav_photos`, {userID})
        if (response.data) {
            setFavPhotos(response.data)
        }}, [])
    
    useEffect(() => {
        if (didMount.current) {
            GetFavPhotos() 
        }
        return didMount.current = true
    }, [update, GetFavPhotos])

    useEffect(() => {
        setFavPhotos(props.location.value)
    }, [props.location.value])

    function setFillColor() {
        return favorite === 1 ? "white" : "black"
    }

    async function AddToTrash() {
        const response = await axios.post(`${process.env.REACT_APP_backend_url}/add_to_trash`, {id})
        if (response.data) {
            store.dispatch({type: "Update", payload: !update})
            NextPhoto("Your photo has been moved to trash", +1)
    }}

    const NextPhoto = useCallback((message, direction) => {
        const photoIndex = favPhotos.findIndex(index => index.id === id)
        if (favPhotos[photoIndex+direction] === undefined) {
            history.push("/favorites")
            return
        }
        const photo = favPhotos[photoIndex+direction]
        store.dispatch(SetPhoto(photo))
        store.dispatch(Message(message))
    }, [favPhotos, id])

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
                    <svg onClick={() => store.dispatch(AddToFavorites(id, favorite, photoKey))} id="favorite-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={setFillColor()} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                 </div>
            
            </div> 
            <div className="photo-display">
                <img src={`${process.env.REACT_APP_cloudfrontURL + photoKey}`} alt="pic" className="selected-photo"/>
            </div>
            {message && <div className="message">{message}</div>}
        </div>
    )
}

export default ClickedFavorite
