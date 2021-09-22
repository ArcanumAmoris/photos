import React, { useEffect, useState } from 'react'
import "./StorageUsage.css"
import axios from 'axios'
import { useSelector } from 'react-redux'
import store from '../../../Redux/Store/Store'

function StorageUsage() {
    const update = useSelector(state => state.UpdateReducer)
    const [bytes, setBytes] = useState()

    function bytesToGB(bytes) {
        const GB = bytes / (1011*1011)
        setBytes(GB.toFixed(2))
        store.dispatch({type: "SetStorage", payload: GB.toFixed(2)})
    }

    useEffect(() => {
        async function getStorageUsage() {
            const response = await axios.post('http://localhost:3001/get_storage', {}, {withCredentials: true})
            if (response.data) {
                bytesToGB(response.data[0].sum)
            }
        } 
        getStorageUsage()
    }, [update])

    function storagePercentage() {
        return (bytes / 50) * 100
    }

    return (
        <div className="storage_div">
            <div>
                <svg width="24px" height="24px" viewBox="0 0 24 24"><path d="M17.5 19h-10A5.51 5.51 0 0 1 2 13.5c0-2.76 2.09-5.09 4.78-5.44A5.975 5.975 0 0 1 12 5c2.97 0 5.45 2.18 5.92 5.02A4.5 4.5 0 0 1 22 14.5c0 2.48-2.02 4.5-4.5 4.5zM12 7a4 4 0 0 0-3.67 2.41l-.25.59-.64.01A3.51 3.51 0 0 0 4 13.5C4 15.43 5.57 17 7.5 17h10a2.5 2.5 0 0 0 0-5H16v-1c0-2.21-1.79-4-4-4z"></path></svg>
            </div>
            <div className="storage_data">
                <h4>Storage</h4>
                <div className="storage_percentage_div">
                    <div className="storage_percentage_line" style={{width: `${storagePercentage()}%`}}></div>
                </div>
                <p>{bytes} MB of 50 MB used</p>
            </div>
        </div>
    )
}

export default StorageUsage;
