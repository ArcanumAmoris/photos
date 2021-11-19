import React from 'react'
import { useState } from 'react'
import "./DeleteAccount.css"
import axios from 'axios'
import { useSelector } from 'react-redux'
import history from '../../../history'
import store from '../../../Redux/Store/Store'
import { Message } from '../../../Redux/Actions/Actions'

function DeleteAccount() {
    let countdown = 6
    const message = useSelector(state => state.MessageReducer.message)
    const [showWarning, setShowWarning] = useState(false)
    const [deleted, setDeleted] = useState(false)
    const userID = useSelector(state => state.UserReducer.userID)

    async function deleteAccount() {
        const result = await axios.post(`${process.env.REACT_APP_backend_url}/delete-account`, 
        {},
        {withCredentials: true})
        if (result.data.error) {
            console.log(result.data.error)
            store.dispatch(Message("Your account could not be deleted!"))
        } else  {
            setShowWarning(false)
            setDeleted(true)
            store.dispatch(Message(result.data.success))
            reRoute()
        }
    }

    function reRoute() {
            setTimeout(() => {
                history.push("/register")
            }, 5000);
    }

    return (
        <div className="delete-account-main">
            {showWarning && 
            <div className="delete-account-warning-wrapper">
                <div className="delete-account-content">

                    <p>Are you sure you want to permanently delete your account?
                    <br></br>
                    This cannot be undone!
                    <br></br>
                    All of your data including your photos will be permanently deleted!
                    </p>

                    <div className="delete-account-buttons-div">
                        <button className="delete-account-cancel-btn" onClick={() => setShowWarning(false)}>Cancel</button>
                        <button className="delete-account-del-btn" onClick={() => deleteAccount()}>Delete</button>
                    </div>

                </div>
            </div>
            }
            {!deleted && <button onClick={() => setShowWarning(!showWarning)} className="delete-account-main-btn">Delete Account</button>}
            {message && <div className="register_message">{message}</div>}
        </div>
    )
}

export default DeleteAccount
