import React from 'react'
import loading from "../Images/loading.svg"
import "./Loading.css"

function Loading() {

    return (
        <div>
            <img src={loading} className="loader" alt="loading"/>
        </div>
    )
}

export default Loading
