import React from 'react'
import { useSelector } from 'react-redux'
import arrow from "../../../Images/arrow.png"
import "./ClickedIMGTrash.css"
import { useHistory } from 'react-router'
import store from "../../../../Redux/Store/Store"
import axios from 'axios'
import { Message, SetPhoto } from '../../../../Redux/Actions/Actions'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'

function ClickedIMGTrash(props) {
    const autoPlayVideos = useSelector(state => state.AutoPlayReducer)
    const message = useSelector(state => state.MessageReducer.message)
    const ref = useRef()
    const TrashPhotos = ref.current = props.location.TrashPhotos
    const update = useSelector(state => state.UpdateReducer)
    const {id} = useSelector(state => state.ClickedPhotoReducer)
    const photo = useSelector(state => state.ClickedPhotoReducer)
    const history = useHistory()

    async function restorePhoto() {
        const photoID = photo.id
        const response = await axios.post(`${process.env.REACT_APP_backend_url}/restore_photo`, {photoID})
        if (response.data) {
            store.dispatch({type: "Update", payload: !update})
            NextPhoto("Your photo has been restored successfully", +1)
        }}

    const NextPhoto = useCallback((message, direction) => {
        const photoIndex = TrashPhotos.findIndex(index => index.id === id)
        if (TrashPhotos[photoIndex+direction] === undefined) {
            history.push("/trash")
            return
        }
        const photo = TrashPhotos[photoIndex+direction]
        store.dispatch(SetPhoto(photo))
        store.dispatch(Message(message))
    }, [TrashPhotos, id, history])

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
    }, [photo, listen])

    async function permanentlyDelete() {
        const photoID = photo.id
        const photoKey = photo.photoKey
        const response = await axios.post(`${process.env.REACT_APP_backend_url}/delete_photo`, {photoID, photoKey})
        if (response.data) {
            NextPhoto("Your Photo has been permanently deleted", +1)
        }
    }

    const playOrPauseVideo = () => {
        const vid = document.getElementById("video")
        if (vid === null) return
        return vid.paused ? vid.play() : vid.pause()
    }

    function videoOrImage() {
        const fileType = photo.photoKey.split(".")[1]
        if (fileType === "mp4") {
            return <video 
                        src={`${process.env.REACT_APP_cloudfrontURL + photo.photoKey}`} 
                        alt="pic" 
                        className="selected-photo" 
                        style={{cursor: "pointer"}} 
                        id='video' 
                        onClick={() => playOrPauseVideo()}
                        autoPlay={autoPlayVideos}
                    />
        } else if (fileType === "jpeg") {
            return <img 
                        src={`${process.env.REACT_APP_cloudfrontURL + photo.photoKey}`} 
                        alt="pic" 
                        className="selected-photo" 
                        style={{cursor: "auto"}}
                    />
        }
    }

    return (
        <div className="trash-selected-image-main">
            <div className="trash-selected-header">
                <div className="trash-selected-arrow" onClick={() => history.goBack()}>
                    <img src={arrow} alt="arrow" className="trash-selected-arrow-img"/>
                </div>
                <div className="trash-selected-icons">
                    <div onClick={() => permanentlyDelete()}>
                        <svg width="24px" height="24px" fill="white" viewBox="0 0 24 24"><path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z M9.41 16.5L12 13.91l2.59 2.59L16 15.09l-2.59-2.59L16 9.91 14.59 8.5 12 11.09 9.41 8.5 8 9.91l2.59 2.59L8 15.09z"></path></svg>
                        <p>Delete</p>
                    </div>
                    <div onClick={() => restorePhoto()}>
                        <svg width="24px" height="24px" fill="white" viewBox="0 0 24 24"><path d="M13 3c-4.76 0-8.64 3.69-8.97 8.37L2.21 9.54.8 10.95 5 15.16l4.21-4.21-1.42-1.41-1.75 1.76C6.39 7.76 9.37 5 13 5c3.87 0 7 3.13 7 7s-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 4.42v5.7l4.55 2.27.9-1.78L14 11.88V7.42z"></path></svg>
                        <p>Restore</p>
                    </div>
                </div>
            </div>
            <div className="trash-selected-img-div">
                {videoOrImage()}
            </div>
            {message && <div className="message">{message}</div>}
        </div>
    )
}

export default ClickedIMGTrash
