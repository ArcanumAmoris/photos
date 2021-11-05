import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from "axios"
import "./Register.css"

function Register() {
    const [success, setSuccess] = useState("")
    const [show, setShow] = useState(false) 
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const history = useHistory()

    async function register(e) {
        e.preventDefault()
        setError("")
        setSuccess("")
        try {
            const response = await axios.post(`${process.env.REACT_APP_backend_url}/register`, {email, password})
            if (response.data.error) {
                setError(response.data.error)
            }
            if (response.data.success) {
                setSuccess(response.data.success)
            }
        } catch (err) {
            console.log(err)
        }}

    function showPassword() {
        return show ? "text" : "password"
    }

    return (
            <div className="register_form_div">
                <form className="register_form" onSubmit={e => register(e)}>
                    <div className="register_header">
                        <h2>Memories</h2>
                        <h2>Create your Memories Account</h2>
                        <p>to continue to Memories</p>
                    </div>
                    <label>Email</label>
                    <input type="email" onChange={e => setEmail(e.target.value)} required placeholder="enter your email"/>
                    <label>Password</label>
                    <input type={showPassword()} onChange={e => setPassword(e.target.value)} required placeholder="enter your password"/>
                    <div className="register_checkbox">
                        <input type="checkbox" onClick={() => setShow(!show)} />
                        <p>Show password</p>
                    </div>
                    <div className="register_btn_div">
                        <button type="button"  onClick={() => history.push("/login")} className="route_to_sign_in">Sign in instead</button>
                        <button type="submit" className="submit_register_btn">Register</button>
                    </div>
                    {success && <div className="register_message">
                        <p>{success}</p>
                    </div>}
                    {error && <div className="register_message" style={{background: "rgba(253, 40, 40, 0.329)"}}>
                        <p>{error}</p>
                    </div>}
                </form>
            </div>
    )
}

export default Register
