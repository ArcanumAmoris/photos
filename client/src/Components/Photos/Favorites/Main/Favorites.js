import React, { useEffect, useState } from 'react'
import store from '../../../../Redux/Store/Store'
import search from "../../../Images/search.png"
import arrow from "../../../Images/arrow.png"
import { useHistory } from 'react-router'
import axios from 'axios'
import "./Favorites.css"
import { SetPhoto } from '../../../../Redux/Actions/Actions'
import Loading from '../../../Loading/Loading'
import { useSelector } from 'react-redux'

function Favorites() {
    const loading = useSelector(state => state.LoadingReducer)
    const [favorites, setFavorites] = useState([])
    const history = useHistory()

    async function GetFavPhotos() {
        const userID = localStorage.getItem("userID")
        const response = await axios.post("http://localhost:3001/get_fav_photos", {userID})
        if (response.data) {
            setFavorites(response.data)
            store.dispatch({type: "SetLoading", payload: false})
        }
    }

    function GoBack() {
        history.push("/")
    }

    useEffect(() => {
        store.dispatch({type: "SetLoading", payload: true})
        GetFavPhotos() 
    }, [])

    function clickedPhoto(photo) {
        store.dispatch(SetPhoto(photo))
        history.push({pathname: "favorite/photo", value: favorites})
    }

    return (
        <div className="favorites">
            <div className="favorites_header">
                <img src={arrow} alt="arrow" className="arrow" onClick={GoBack}/>
                <div className="favorites_input_div">
                    <img src={search} alt="search"></img>
                    <input type="text" className="favorites_input" placeholder="Search your photos"/>
                </div>
            </div>
            <div className="favorite_photos">
            {favorites.map((photo) => {
                return <div className="favorite_photo_div" key={photo.id}>
                            <img src={`${process.env.REACT_APP_cloudfrontURL + photo.photoKey}`}  alt="favorite" onClick={() => clickedPhoto(photo)} /> 
                            <svg id="favorite_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        </div>
                     })}
            </div>
            {loading && <Loading />}
        </div>
    )}

export default Favorites
