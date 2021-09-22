// import React from 'react'
// import gold from "../../../Images/gold.svg"
// import diamond from "../../../Images/diamond.svg"
// import "./Cards.css"

// function Cards({setAmount, amount}) {

//     function handleChange() {

//     }

//     return (
//         <div className="cards_main">

//             <div className="cards_content">

//                 <div className="card_user_info">
//                     <h2>Hello Christina</h2>
//                     <p>You currently have a basic account. Select a service that's right for you.</p>
//                 </div>
                
//                 <div className="cards_div">

//                     <div className="upgrade_cards">
//                         <div className="card_header">
//                             <h3>Plus</h3>
//                         </div>

//                         <h1>$15</h1>
//                         <p>With Plud you can store up to 50 MB of photos and videos. Your photos and videos will be stord in their original quality.</p>
//                         <input 
//                         type="radio" 
//                         checked={amount === 15}
//                         onChange={() => setAmount(15)}
//                         />

//                     </div>

//                     <div className="upgrade_cards">

//                             <div className="card_header">
//                                 <h3>Gold</h3>
//                                 <img src={gold}/>
//                             </div>

//                             <h1>$30</h1>
//                             <p>With Gold you can store up to 100 MB of photos and videos. Your photos and videos will be stord in their original quality.</p>
//                             <input 
//                             type="radio" 
//                             checked={amount === 30}
//                             onChange={() => setAmount(30)}/>

//                     </div>

//                     <div className="upgrade_cards">

//                         <div className="card_header">
//                             <h3>Platinum</h3>
//                             <img src={diamond}/>
//                         </div>

//                         <h1>$40</h1>
//                         <p>With Platinum you can securely store up to 1 GB of photos and videos with blazing fast download speeds for when you need your photos and videos on the go.</p>
//                         <input 
//                         type="radio" 
//                         checked={amount === 40}
//                         onChange={() => setAmount(40)}/>

//                     </div>

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Cards
