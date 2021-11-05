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

    useEffect(() => {
        store.dispatch({type: "SetLoading", payload: true})
        store.dispatch(GetPhotos())
    }, [update])

    function clickedPhoto(photo) {
        store.dispatch(SetPhoto(photo))
        history.push("/photo")
    }

    return (
        <div className="photos"> 
            {photos && photos.length > 0 && photos.map(photo => {
                return <div key={photo.id}><img src={`${process.env.REACT_APP_cloudfrontURL + photo.photoKey}`} className="photos-img" loading="lazy" alt="pic" key={photo.id} onClick={() => clickedPhoto(photo)}/>
                </div>
            })}
            {loading && <Loading />}
            {message && <div className="message">{message}</div>}
        </div>
    )
}

export default Photos
