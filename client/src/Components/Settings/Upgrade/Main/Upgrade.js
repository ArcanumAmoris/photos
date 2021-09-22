// import "./Upgrade.css"
// import React, { useState } from 'react';
// import {CardElement, useStripe, useElements, Elements} from '@stripe/react-stripe-js';
// import { Redirect } from 'react-router-dom';
// import axios from "axios";
// import Cards from "../Cards/Cards";
// import history from "../../../../history";

// function Upgrade(props) {
//   const [amount, setAmount] = useState()
//   const [name, setName] = useState('Jenny Rosen');
//   const [messages, setMessage] = useState('');
//   const elements = useElements();
//   const stripe = useStripe()  

//   if (!stripe || !elements) {
//     return '';
//   }

//   const cardElement = elements.getElement(CardElement);

//   async function handleSubmit(e) {
//     e.preventDefault()
//     const createToken = await stripe.createToken(cardElement)
//     const token = createToken.token.id
//     const sendPayment = await axios.post("http://localhost:3001/checkout", {token, amount}, {withCredentials: true})
//     if (sendPayment.data.status === "succeeded") {
//       history.push("/settings/upgrade/success")
//     } else {
//     }
//   }

//     return (
//       <div className="upgrade_main">

//         <Cards setAmount={setAmount} amount={amount}/>

//         <div className="upgrade_form_div">
//           <form onSubmit={handleSubmit}>
//             <div className="upgradeInputDiv">
//               <label className="UpgradeFormLabel">Name</label>
//               <input type="text" className="UpgradeFormInput" placeholder="Jane Doe"/>
//             </div>
//             <div className="upgradeInputDiv">
//               <label className="UpgradeFormLabel">Email</label>
//               <input type="text" className="UpgradeFormInput" placeholder="janedoe@gmail.com"/>
//             </div>
//             <div className="upgradeInputDiv">
//               <label className="UpgradeFormLabel">Phone</label>
//               <input type="text" className="UpgradeFormInput" placeholder="(929) 456 7898"/>
//             </div>
//               <CardElement />
//               <button disabled={!stripe || !amount}>Pay ${amount}</button>
//               <div>{messages}</div>
//             </form>
//         </div>
//       </div>
//   )
// }

// export default Upgrade;
