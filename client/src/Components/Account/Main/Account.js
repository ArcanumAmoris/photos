import React from 'react'
import "./Account.css"
import account from "../../Images/account.png"
import email from "../../Images/email.png"
import password from "../../Images/password.png"
import credit_card from "../../Images/credit_card.png"
import arrow from "../../Images/arrow.png"
import {useHistory} from "react-router"


function Account() {
    const history = useHistory()

    return (
        <div className="account_outer_div">
            <div className="sidemenu_account">
                <div className="header_account">
                    <div className="arrow_account" onClick={() => history.goBack()}>
                        <img src={arrow} alt="arrow" className="arrow_account_icon"/>
                    </div>
                    <div className="header_title_account">
                        <h3>Account Menu</h3>
                    </div>
                </div>
                <button className="sidemenu_account_item" onClick={() => history.push("/account/profile")}>
                    <img src={account} alt="change profile"/>
                    <p>Profile</p>
                </button>
                <button className="sidemenu_account_item">
                    <img src={email} alt="update email"/>
                    <p>Update Email</p>
                </button>
                <button className="sidemenu_account_item">
                    <img src={password} alt="reset password"/>
                    <p>Change Password</p>
                </button>
                <button className="sidemenu_account_item">
                    <img src={credit_card} alt="credit card"/>
                    <p>Update Credit Card</p>
                </button>
                <button className="sidemenu_account_item">
                    <img src={account} alt="delete account"/>
                    <p>Delete account</p>
                </button>
            </div>
        </div>
    )
}

export default Account
