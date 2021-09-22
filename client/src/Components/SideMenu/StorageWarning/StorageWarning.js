import React from 'react'
import history from '../../../history'
import "./StorageWarning.css"

function StorageWarning(props) {

    function routeToSettings() {
        history.push("/settings/upgrade")
        props.value(false)
    }
    return (
        <div className="storage_limit_warning">
            <div className="storage_warning_content">
                <p>You have reached the 50 mb limit upgrade your account to continue uploading</p>
                <div className="storage_warning_buttons">
                    <button className="storage_warning_back" onClick={() => props.value(false)}>back</button>
                    <button className="storage_warning_upgrade_btn" onClick={() => routeToSettings()}>Upgrade</button>
             </div>
        </div>
    </div>
    )
}

export default StorageWarning
