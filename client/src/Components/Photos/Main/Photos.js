import React, { useEffect} from 'react'
import {useSelector } from "react-redux"
import { GetPhotos, SetPhoto } from '../../../Redux/Actions/Actions'
import store from '../../../Redux/Store/Store'
import history from '../../../history'
import './Photos.css'
import Loading from '../../Loading/Loading'

function Photos() {
    const loading = useSelector(state => state.LoadingReducer)
    const message = useSelector(state => state.MessageReducer.message)
    const update = useSelector(state => state.UpdateReducer)
    const photos = useSelector(state => state.PhotosReducer.photos)
    const autoPlayVideos = useSelector(state => state.AutoPlayReducer)

    useEffect(() => {
        store.dispatch({type: "SetLoading", payload: true})
        store.dispatch(GetPhotos())
    }, [update])

    function clickedPhoto(photo) {
        store.dispatch(SetPhoto(photo))
        history.push("/photo")
    }

    function videoOrImage(photo) {
        const fileType = photo.photoKey.split(".")[1]
        if (fileType === "mp4") {
            return <div key={photo.id}>
                <video 
                    src={`${process.env.REACT_APP_cloudfrontURL + photo.photoKey}`} 
                    className="photos-img" 
                    autoPlay={autoPlayVideos}
                    loop={true}
                    loading="lazy" 
                    alt="pic" 
                    key={photo.id} 
                    onClick={() => clickedPhoto(photo)} 
                    id="user-video" 
                    muted={true}
                />
            </div>
        } else if (fileType === "jpeg") {
            return <div key={photo.id}>
                <img 
                    src={`${process.env.REACT_APP_cloudfrontURL + photo.photoKey}`} 
                    className="photos-img" 
                    loading="lazy" 
                    alt="pic" 
                    key={photo.id} 
                    onClick={() => clickedPhoto(photo)}
                />
                </div>
        }
    }

    return (
        <div className="photos"> 
            {photos && photos.length > 0 && photos.map(photo => {
                return videoOrImage(photo)
            })}
            {loading && <Loading />}
            {message && <div className="message">{message}</div>}
        </div>
    )
}

export default Photos
