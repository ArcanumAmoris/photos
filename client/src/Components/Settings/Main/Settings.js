import React from 'react'
import Header from '../../Header/Header'
import SideMenu from '../../SideMenu/Main/SideMenu'
import "./Settings.css"
import { useSelector } from 'react-redux'
import store from '../../../Redux/Store/Store'
import sun from "../../Images/sun.svg"
import moon from "../../Images/moon.png"
import toggleCheck from "../../Images/toggleCheck.png"
// import toggleOff from "../../Images/toggleOff.svg"

function Settings() {
    const darkTheme = useSelector(state => state.DarkThemeReducer)
    const autoPlayVideos = useSelector(state => state.AutoPlayReducer)

    function toggleTheme() {
        return store.dispatch({type: "SetTheme", payload: !darkTheme})
    }

    function toggleAutoPlay() {
        return store.dispatch({type: "SetAutoPlay", payload: !autoPlayVideos})
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
                    
                    <div className="settings_toggle_div">
                        <p>Dark theme</p>
                        <div className="settings_toggle" onClick={() => toggleTheme()}> 
                            {!darkTheme && <img src={sun} className="settings_drk_them_off"  alt="sun"/>}
                            {darkTheme && <img src={moon} className="settings_check"alt="moon" />}
                        </div>
                    </div>

                    <div className="settings_toggle_div">
                        <p>AutoPlay videos</p>
                        <div className="settings_toggle" onClick={() => toggleAutoPlay()}> 
                            {!autoPlayVideos && <div className="toggle-off-parent"><div className="toggle-off-symbol"></div></div>}
                            {autoPlayVideos && <img src={toggleCheck} className="settings_check"alt="moon" />}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Settings
