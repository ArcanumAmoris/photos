import React from 'react'
import search from "../Images/search.png"
import upload from "../Images/upload.png"
import settings from "../Images/settings.png"
import "./Header.css"
import axios from 'axios'
import store from "../../Redux/Store/Store"
import {Update} from "../../Redux/Actions/Actions"
import {useSelector} from "react-redux"
import { Message } from '../../Redux/Actions/Actions'
import Resizer from "react-image-file-resizer";
import { useState } from 'react'
import StorageWarning from '../SideMenu/StorageWarning/StorageWarning'
import history from '../../history'

function Header() {
    const storageUsage = useSelector(state => state.StorageReducer)
    const [showLimitWarning, setShowWarning] = useState(false)
    const allowedFileExtensions = ["image/jpeg", "image/png", "video/mp4", "image/svg+xml"]
    const [error, setError] = useState("")

    function bytesToGB(bytes) {
        const MB = bytes / (1011*1011)
        return Number(MB.toFixed(2))
    }

    const resizeImage = (file) =>
    new Promise((resolve) => {
        if (!file) return
        Resizer.imageFileResizer(file, 1920, 1920, "JPEG", 80, 0, (uri) => {
            resolve(uri)
            return uri
        },
        "blob"
        );
    });

    async function UploadImage(e) {
        if (!e.target.files[0]) return
        const fileSize = await bytesToGB(e.target.files[0].size)
        store.dispatch({type: "SetLoading", payload: true})
        if (fileSize + Number(storageUsage) > 20) {
            setShowWarning(true) 
            store.dispatch({type: "SetLoading", payload: false})
            return 
        }
        if (!allowedFileExtensions.includes(e.target.files[0].type)) {
            store.dispatch({type: "SetLoading", payload: false})
            return setError("OOPS! You cannot upload a file with that extension!")
        }
        const formData = new FormData()
        if (e.target.files[0].type === "video/mp4") {
            const video = e.target.files[0]
            formData.append("myImage", video)
        } else {
            const image =  await resizeImage(e.target.files[0])
            formData.append("myImage", image)    
        }
        const response = await axios.post(`${process.env.REACT_APP_backend_url}/upload`, 
        formData,
        {withCredentials: true}, 
        )
        if (response.data) {
            store.dispatch({type: "SetLoading", payload: false})
            store.dispatch(Update())
            store.dispatch(Message("Your photo has been uploaded successfully"))
        }}

    function routeToHome() {
        history.push("/")
        window.location.reload()
    }

    function signOut() {
        localStorage.clear()
        history.replace("/login")
    }

    return (
        <header className="header">
            <div className="header-items">
                <div className="logo" onClick={() => routeToHome()}>
                    <svg viewBox="0 0 24 24" className="svg_header"><path d="M17.5 19h-10A5.51 5.51 0 0 1 2 13.5c0-2.76 2.09-5.09 4.78-5.44A5.975 5.975 0 0 1 12 5c2.97 0 5.45 2.18 5.92 5.02A4.5 4.5 0 0 1 22 14.5c0 2.48-2.02 4.5-4.5 4.5zM12 7a4 4 0 0 0-3.67 2.41l-.25.59-.64.01A3.51 3.51 0 0 0 4 13.5C4 15.43 5.57 17 7.5 17h10a2.5 2.5 0 0 0 0-5H16v-1c0-2.21-1.79-4-4-4z"></path></svg>                   
                     <h1>Memories</h1>
                    <p>Your Memory Cloud</p>
                </div>
                <div className="search-box">
                    <img src={search} alt="search"></img>
                    <input type="text" placeholder="Search Memory Lane"/>
                </div>
                <div className="icons">
                    <label htmlFor="file-input" className="upload">
                        <img src={upload} alt="upload"></img>
                        <p>Upload</p>
                    </label>
                    <input type="file" id="file-input" onChange={(e) => {UploadImage(e)}}/>
                    <img src={settings} alt="settings" onClick={() => history.push("/settings")}></img>
                    {/* <img src={account} alt="account" onClick={() => history.push("/account")}></img> */}
                    <button onClick={() => signOut()}>Sign out</button>
                </div>
            </div>
            {showLimitWarning && <StorageWarning value={setShowWarning}/>}
            {error && <div className="login_error">
                <p>{error}</p>
                </div>}
        </header>
    )
}

export default Header
