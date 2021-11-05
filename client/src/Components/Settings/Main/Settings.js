import React from 'react'
import Header from '../../Header/Header'
import SideMenu from '../../SideMenu/Main/SideMenu'
import "./Settings.css"
// import darkThemePreview from "../../Images/dark_preview.svg"
// import lightPreview from "../../Images/light_preview.svg"
import { useSelector } from 'react-redux'
import store from '../../../Redux/Store/Store'
import sun from "../../Images/sun.svg"
import moon from "../../Images/moon.png"

function Settings() {
    const darkTheme = useSelector(state => state.DarkThemeReducer)

    function toggleTheme() {
        return store.dispatch({type: "SetTheme", payload: !darkTheme})
    }
    
    return (
        <div className="settings_main">
            <Header />
            <SideMenu />
            <div className="settings_header">
                <h2>Settings</h2>
            </div>
            <div className="settings_content_main">
                <div className="settings_dark_theme">
                    {/* <div className="settings_prev_imgs">
                        <img src={darkThemePreview} alt="drk_prev"/>
                        <img src={lightPreview} alt="light_prev" className="light_prev"/>
                    </div> */}
                    <div className="settings_toggle_div">
                        <p>Dark theme</p>
                        <div className="settings_toggle" onClick={() => toggleTheme()}> 
                            {!darkTheme && <img src={sun} className="settings_drk_them_off"  alt="sun"/>}
                            {darkTheme && <img src={moon} className="settings_check"alt="moon" />}
                        </div>
                    </div>
                </div>
                {/* <button onClick={() => history.push("/settings/upgrade")}>Upgrade Account</button> */}
            </div>
        </div>
    )
}

export default Settings
