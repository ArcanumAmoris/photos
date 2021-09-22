import React from 'react'
import "./Welcome.css"

function Welcome() {
    return (
        <div className="welcome_main">
            <div className="welcome_div">
                <h1>Account confirmed!</h1>
            </div>
            <a href="http://localhost:3005/login">Please Login</a>
        </div>
    )
}

export default Welcome
