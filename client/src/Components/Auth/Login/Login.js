import axios from 'axios'
import React, { useState } from 'react'
import history from '../../../history'
import store from '../../../Redux/Store/Store'
import "./Login.css"

function Login() {
  const [message, setMessage] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showResendBtn, setShowResendBtn] = useState(false)

    async function login(e) {
        e.preventDefault()
        setShowResendBtn(false)
        const response = await axios.post("http://localhost:3001/login", {email, password}, {withCredentials: true})
        if (response.data.error) {
          return setMessage(response.data.error)
        }
        if (response.data.unverified) {
          setShowResendBtn(true)
          return setMessage(response.data.unverified)
        }
        if (response.data.auth) {
          await history.push("/")
          localStorage.setItem("userID", response.data.id)
          return store.dispatch({type: "setUser", payload: response.data})
        }}

    async function resendLink() {
      const response = await axios.post("http://localhost:3001/resend_link", {email})
      if (response.data) {
        setMessage(response.data)
      }
    }

    return (
        <div className="form_div">
          <form className="login_form" onSubmit={(e) => login(e)}>
              <div className="login_header">
                  <h2>Memories</h2>
                  <h2>Sign in</h2>
                  <p>to continue to Memories</p>
              </div>
              <label>Email</label>
              <input type="text" onChange={e => setEmail(e.target.value)} required placeholder="enter your email"/>
              <label>Password</label>
              <input type="password" onChange={e => setPassword(e.target.value)} required placeholder="enter your password"/>
              <div className="login_btn_div">
                <button className="route_to_register_btn" onClick={() => history.push("/register")} type="button">Create account</button>
                <button className="login_submit_btn" type="submit">Sign in</button>
              </div>
              {message && <div className="login_error">
                <p>{message}</p>
                {showResendBtn && <button type="button" onClick={() => resendLink()}>Resend</button>}
              </div>}
          </form>
        </div>
    )
}

export default Login
