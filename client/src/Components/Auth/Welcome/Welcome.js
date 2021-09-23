import React from 'react'
import "./Welcome.css"

function Welcome() {
    return (
        <div className="welcome_main">
            <div className="welcome_div">
                <h1>Account confirmed!</h1>
            </div>
            <a href={`${process.env.REACT_APP_client_url}/login`}>Please Login</a>
        </div>
    )
}

export default Welcome
