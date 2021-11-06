import React, {useEffect, useState} from 'react'
import SideMenu from "../../../SideMenu/Main/SideMenu"
import EmptyTrash from "../../../Images/UndoDelete.png"
import Header from "../../../Header/Header"
import axios from "axios"
import "./Trash.css"
import { useHistory } from 'react-router'
import store from '../../../../Redux/Store/Store'
import { useSelector } from 'react-redux'
import { Message } from '../../../../Redux/Actions/Actions'
import Loading from '../../../Loading/Loading'

function Trash() {
    const loading = useSelector(state => state.LoadingReducer)
    const autoPlayVideos = useSelector(state => state.AutoPlayReducer)
    const message = useSelector(state => state.MessageReducer.message)
    const [showDiv, setShowDiv] = useState(false)
    const [TrashPhotos, setTrashPhotos] = useState([])
    const history = useHistory()

    async function GetTrash() {
        const response = await axios.post(`${process.env.REACT_APP_backend_url}/get_trash`, {}, {withCredentials: true})
        if (response.data) {
            setTrashPhotos(response.data)
            store.dispatch({type: "SetLoading", payload: false})
        }}

    useEffect(() => {
        store.dispatch({type: "SetLoading", payload: true})
        GetTrash()
    }, [])

    async function clearTrash() {
        const response = await axios.post(`${process.env.REACT_APP_backend_url}/empty_trash`, {}, {withCredentials: true})
        if (response.data) {
            store.dispatch(Message("Trash has been cleared"))
            setShowDiv(false)
        }
    }

    function clickedPhoto(photo) {
        store.dispatch({type: "SelectedPhoto", payload: photo})
        history.push({pathname: "/trash/photo", TrashPhotos: TrashPhotos})
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
        <div className="trash_main">
            <Header />
            <SideMenu />
            <div className="trash_photos">
                <div className="empty_trash_main">
                    <h4>Trash</h4>
                    {showDiv && <div className="delete_warning">
                        <p>Are you sure you want to permanently delete all photos in trash?</p>
                        <button className="trash_cancel_btn" onClick={() => setShowDiv(false)}>Cancel</button>
                        <button className="trash_delete_btn" onClick={() => clearTrash()}>Empty trash</button>
                    </div>}
                    <div className="empty_trash" onClick={() => setShowDiv(!showDiv)}>
                        <img src={EmptyTrash} alt="empty_trash" />
                        <p>Empty trash</p>
                    </div>
                </div>

                <p className="text">Items will be permanently deleted after 60 days from Trash.</p>

                {TrashPhotos.map(photo => {
                    return videoOrImage(photo)
                })}
                
            </div>
            {loading && <Loading />}
            {message && <div className="message">{message}</div>}
        </div>
    )
}

export default Trash
