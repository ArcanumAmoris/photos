import axios from 'axios'
import React, { useEffect, useState } from 'react'
import "./Profile.css"
import profile from "../../Images/profile.png"
import store from '../../../Redux/Store/Store'
import { useSelector } from 'react-redux'
import Account from '../Main/Account'
import {Message} from "../../../Redux/Actions/Actions"
 
function Profile() {
    const message = useSelector(state => state.MessageReducer.message)
    const [userProfile, setUserProfile] = useState()
    const [name, setName] = useState('')
    const [update, setUpdate] = useState(false)
    const [username, setUsername] = useState("")
    const [status, setStatus] = useState("")

    async function getProfileImg() {
        const userID = localStorage.getItem("userID")
        const response = await axios.post("http://localhost:3001/get_profile", {userID})
        if (response.data.length) {
            setName(response.data[0].username)
            setStatus(response.data[0].status)
            setUsername(response.data[0].username)
            setUserProfile(response.data[0].profileUrl)
        }
    }

    async function updateProfileImg(e) {
        e.preventDefault()
        const form = new FormData()
        form.append("myImage", e.target.files[0])
        const userID = localStorage.getItem("userID")
        const response = await axios.post(`http://localhost:3001/update_profile_img/${userID}`, form)
        if (response.data) {
            store.dispatch(Message("Your profile photo has been updated"))
            setUpdate(!update)
        }
    }

    async function handleSubmit() {
        const userID = localStorage.getItem("userID")
        const response = await axios.post("http://localhost:3001/update_profile", {userID, username, status})
        if (response.data) {
            store.dispatch(Message("Your changes have been saved"))
            setUpdate(!update)
        }
    }

    useEffect(() => {
        getProfileImg()
    }, [update])

    return (
        <main className="profile_account">
            <Account />
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="input_fields_profile">
                    <h1>Welcome {name}</h1>
                    <h3>Update your Profile Picture</h3>
                    <label htmlFor="profile_input" className="circular">
                        <img src={userProfile == null ? profile : userProfile} alt="profile" className="profile_img"/>
                    </label>
                    <input id="profile_input" type="file" style={{display: 'none'}} onChange={(e) => {updateProfileImg(e)}}/>
                        <p>Update your Username</p>
                        <input type='text' name="abc" onChange={(e) => setUsername(e.target.value)} defaultValue={username}/>
                        <p>Update your Status</p>
                        <input type='text'  name="blah" className="status_profile" defaultValue={status} onChange={(e) => setStatus(e.target.value)}/>
                        <button type="submit" onClick={() => handleSubmit()}>Save Changes</button>
                    </div>
                </form>
                {message && <div className="message">{message}</div>}
        </main>
    )
}

export default Profile
