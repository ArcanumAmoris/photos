import React, { useState } from 'react'
import photos from '../../Images/photos.png'
import search from '../../Images/search.png'
import share from '../../Images/share.png'
import favorites from '../../Images/favorites.svg'
import hamburger from '../../Images/hamburger.svg'
import trash from '../../Images/trash.png'
import "./SideMenu.css"
import { useHistory } from 'react-router'
import StorageUsage from '../StorageUsage/StorageUsage' 


function SideMenu() {
    const [showMenu, setShowMenu] = useState(false)
    const history = useHistory()

    function RouteToFavorites() {
        history.push("/favorites")
    }

    function RouteToTrash() {
        history.push("/trash")
    }

    function RouteToHome() {
        history.push("/")
    }

    function toggle() {
        if (window.innerWidth >= 401) return
        return showMenu ? {display: "inline", width: "260px"} : {display: "none"}
    }

    return (
        <>
        <img src={hamburger} alt="toggle menu" onClick={() => setShowMenu(!showMenu)} className="toggle-menu-hamburger"/>
        <div className="sidemenu" style={toggle()}>
            <div className="links_div">
                <div className="create_margin_top"></div>
                <button className="sidemenu-item" onClick={RouteToHome}>
                    <img src={photos} alt="photos"></img>
                    <p>Photos</p>
                </button>
                <button className="sidemenu-item">
                    <img src={search} alt="search"></img>
                    <p>Search</p>
                </button>
                <button className="sidemenu-item">
                    <img src={share} alt="share"></img>
                    <p>Share</p>
                </button>
                <button className="sidemenu-item" onClick={RouteToFavorites}>
                    <img src={favorites} alt="favorites"></img>
                    <p>Favorites</p>
                </button>
                <button className="sidemenu-item" onClick={RouteToTrash}>
                    <img src={trash} alt="trash"></img>
                    <p>Trash</p>
                </button>
            </div>
            <StorageUsage />
        </div>
        </>
    )
}

export default SideMenu
