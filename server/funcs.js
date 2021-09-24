const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken");

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "lobsterfordinner1@gmail.com",
        pass: process.env.REACT_APP_email_pass,
    }
})

module.exports.sendConfirmationEmail = (email, confirmationCode) => {
    console.log("Check");
    transport.sendMail({
      from: "lobsterfordinner1@gmail.com",
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <a href=${process.env.REACT_APP_backend_url}/confirm/${confirmationCode}> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
}; 

    module.exports.verifyJWT = (req, res, next) => {
    const accessToken = req.headers.cookie.split("access-token=")[1].split(";")[0]
    if (!accessToken) {
        return console.log("No accessToken")
    } else {
        jwt.verify(accessToken, process.env.REACT_APP_JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    console.log(err.name)
                }
                return console.log(err)
            } else {
                req.userID = decoded.id
                next()
        }}
    )}
}