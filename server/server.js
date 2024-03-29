const express = require("express")
const app = express()
const mysql = require('mysql');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const cors = require("cors")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const multer = require("multer")
const AWS = require("aws-sdk")
const { v4: uuid } = require('uuid');
// const { default: Stripe } = require("stripe");
require('dotenv').config()
const {sendConfirmationEmail, verifyJWT} = require("./funcs")
// const stripe = new Stripe(process.env.REACT_APP_stripe_secret)
app.use(cors({credentials: true, origin: process.env.ORIGIN_ALLOWED, optionsSuccessStatus: 200, methods: ['GET,HEAD,PUT,PATCH,POST,DELETE']}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

app.set("trust proxy", true)

const db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----')
    console.log(error)
    console.log('----- Exception origin -----')
    console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
})

app.post("/register", async (req, res) => {
    try {
        const {email, password} = req.body
        db.query("SELECT email FROM users WHERE email = ?", [email],
        (err, result) => {
            if (err) {
                return console.log(err)
            } 
            else if (result.length > 0) {
                res.send({error: "An account with that email already exists."})
            } else {
                saveUser(res, email, password)
            }
        })
    } catch (e) {
        console.log(e)
    }
 })

async function saveUser(res, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const confirmationToken = await jwt.sign({email}, process.env.REACT_APP_JWT_SECRET, {expiresIn: "24h"})
    db.query("INSERT INTO users (email, password, confirmationtoken) VALUES (?,?,?)", [email, hashedPassword, confirmationToken],
    (err, result) => {
        if (result) {
            res.send({success: "Your account has been registered. Please verify your email to continue."})
            sendConfirmationEmail(email, confirmationToken)
        } else {
            if (err) {
                console.log(err)
                res.send({error: "An error occurred your account has not been registered."})
            }
        }
    }
) 
}

app.post("/resend_link", (req, res) => {
    const {email} = req.body
    const token = jwt.sign({email}, process.env.REACT_APP_JWT_SECRET, {expiresIn: "24h"})
    db.query("UPDATE users SET confirmationtoken = ? WHERE email = ?", [token, email],
    (err, result) => {
        if (result) {
            sendConfirmationEmail(email, token)
            res.send("A new link has been sent.")        
        } else {
            console.log(err)
        } 
    }
)})

app.get("/confirm/:confirmid", (req, res) => {
    const {confirmid} = req.params
    db.query("SELECT confirmationtoken, id FROM users WHERE confirmationtoken = ?", 
    [confirmid],
    async (err, result) => {
        if (result.length > 0) { 
            if (result[0].confirmationtoken.length > 0) {
                try {
                    const checkIfValid = await jwt.verify(result[0].confirmationtoken, process.env.REACT_APP_JWT_SECRET)
                    if (checkIfValid) {
                        db.query("UPDATE users SET status = 'active' WHERE id = ?", [result[0].id],
                        (err, result) => {
                            err ? console.log(err) : createS3Folder(result.id, res, confirmid)
                        })
                    } 
                } catch (error) {
                    console.log(error)
                }
            } else {
                console.log(err)
            }
        } else {
            res.redirect(`${process.env.ORIGIN_ALLOWED}/login`, {message: "Fuck off"})
        }
    })
})
 
function createS3Folder(userID, res, token) {
    db.query("UPDATE users SET confirmationtoken = '' where confirmationtoken = ?", [token])
    const params = { Bucket: 'photos-photos', Key: `${userID}/`, ACL: '', Body: ""};
    s3.upload(params, (err, data) => {
        err ? console.log(err) : res.redirect(`${process.env.ORIGIN_ALLOWED}/welcome`)
    })}

app.get("/logout", (req, res) => {
    res.send({redirect: "/login"})
})

// function createCharge(token, amount) {
//     return stripe.charges.create({
//         amount: amount * 100,
//         currency: 'usd',
//         source: token,
//         description: "Noice"
//     })}

// app.post("/checkout", verifyJWT, async (req, res) => {
//     const {token} = req.body
//     const {amount} = req.body
//     try { 
//        let data = await createCharge(token, amount)
//        res.send(data)
//     } catch (e) {
//         console.log(e)
//         res.status(500)
//     }
// })

app.post("/login", (req, res) => {
    const {email, password} = req.body;
    db.query("SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
        if (result.length > 0) {
            if (result[0].status === 'pending') {
                return res.send({unverified: "Please verify your email to sign in."})
            }
            bcrypt.compare(password, result[0].password, (error, response) => {
                if (response) {
                    const id = result[0].id
                    const token = jwt.sign({id}, process.env.REACT_APP_JWT_SECRET, {expiresIn: "7007979000d"})
                    res.cookie("access-token", token, { expires: new Date(Date.now() + 900*9000000), httpOnly: true, sameSite: 'none', secure: true})
                    res.status(200).send({auth: true, result, id});
                } else {
                    res.json({error: "Wrong username/password" })
                }})
        } else {
            res.json({error: "User does not exist" })
        }} 
    )
})

const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_accessKeyId,
    secretAccessKey: process.env.REACT_APP_secretAccessKey,
    signatureVersion: 'v4',
    region: 'us-east-2',
}) 

const storage = multer.memoryStorage({
    destination: (req, file, callback) => {
        callback(null, '')
    }
})

const upload = multer({storage}).single('myImage')
  
app.post("/upload", verifyJWT, upload, (req, res) => {
    const fileSize = req.file.size
    const userID = req.userID
    const fileType = req.file.mimetype.split("/")[1]
    const params = {
        Bucket: `photos-photos/${userID}`,
        Key: `${uuid()}.${fileType}`,
        Body: req.file.buffer
    }
    s3.upload(params, (error, data) => {
        db.query("INSERT INTO photos (userID, fileSize, photoKey) VALUES (?,?,?)", 
        [userID, fileSize, data.Key],
        (err, result) => {
            err ? res.send(err) : res.status(200).send("Your photo has been saved")
        })
    })
})

app.post("/getphotos", verifyJWT, (req, res) => {
    const userID = req.userID
    db.query("SELECT id, favorite, photoKey FROM photos WHERE userID = (?) AND trash = 0", 
    [userID], 
    (err, result) => {
        err ? console.log(err) : res.status(200).send(result)
    })
})

app.post("/favorite", (req, res) => {
    const photoID = req.body.id
    db.query("UPDATE photos SET favorite = 1 - favorite WHERE id = ?",
    [photoID], 
    (err, result) => {
        err ? console.log(err) : res.send(result)
    })
})

app.post("/get_fav_photos", (req, res) => {
    const userID = req.body.userID
    db.query("SELECT id, favorite, photoKey FROM photos WHERE userID = ? AND favorite = 1 AND trash = 0", 
    [userID],
    (err, result) => {
        err ? console.log(err) : res.send(result)
    })
})

app.post("/add_To_trash", (req, res) => {
    const photoID = req.body.id
    db.query("UPDATE photos SET trash = 1 - trash WHERE id = ?", 
    [photoID], 
    (err, result) => {
        err ? console.log(err) : res.send(result)
    })
})

// app.post("/del", (req, res) => {
//     const key = req.body.photoKey
//     console.log(key)
//     const par =  {
//                 Bucket: `photos-photos`,
//                 Key: '/5',
//             }
//             s3.deleteObject(par, (err, data) => {
//                 err ? console.log(err) : console.log(data)
//             })
// })

app.post("/get_trash", verifyJWT, (req, res) => {
    const userID = req.userID
    db.query("SELECT id, photoKey FROM photos WHERE userID = ? AND trash = 1", 
    [userID], 
    (err, result) => {
        err ? console.log(err) : res.send(result)
    })
})

app.post("/restore_photo", (req, res) => {
    const photoID = req.body.photoID
    db.query("UPDATE photos set trash = 1 - trash WHERE id = ?",
    [photoID], 
    (err, result) => {
        err ? console.log(err) : res.send(result)
    })
})

app.post("/get_storage", verifyJWT, (req, res) => {
    const userID = req.userID
    db.query("SELECT SUM(fileSize) AS sum FROM photos WHERE userID = ?", 
    [userID], 
    (err, result) => {
        err ? console.log(err) : res.send(result)
    })
})

app.post("/get_profile", (req, res) => {
    const userID = req.body.userID 
    db.query("SELECT profileUrl, status, username FROM profile WHERE id = ?", 
    [userID],
    (err, result) => {
        err ? console.log(err) : res.send(result)
    })
})

// app.post("/update_profile_img/:id", upload, (req, res) => {
//     const myFile = req.file.originalname.split('.')
//     const userID = req.params.id
//     const fileType = myFile[myFile.length - 1]
//     const params = {
//         Bucket: `photos-photos/${userID}`,
//         Key: `${uuid()}.${fileType}`,
//         Body: req.file.buffer
//     }
//     s3.upload(params, (error, data) => {
//         db.query("INSERT INTO profile (profileUrl, id) VALUES(?,?) ON DUPLICATE KEY UPDATE photoKey=?, profileUrl=?", 
//         [data.Location, userID, data.key, data.Location],
//         (err, result) => {
//             err ? console.log(err) : res.status(200).send("Your profile has been updated")
//         })
//         db.query("SELECT photoKey FROM profile WHERE id = ?", 
//         [userID], 
//         (err, result) => {
//             try {
//               const params = { Bucket: "photos-photos", Key: result[0].photoKey}
//                 s3.deleteObject(params, (err, data) => {
//                     if (err) {
//                         console.log(err)
//                     } else {
//                         console.log(data)
//                      }
//                 })
//             } catch (error) {
//                 console.log(error)
//             }
//         })
//     })
// })

app.post("/delete_photo", (req, res) => {
    const photoID = req.body.photoID
    const photoKey = req.body.photoKey   
    deletePhoto(photoKey, photoID, res) 
})

function deletePhoto(photoKey, photoID, res) {
    try {
        const params = { 
            Bucket: "photos-photos", 
            Key: photoKey
        }
        s3.deleteObject(params, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                console.log(data)
                db.query("DELETE FROM photos WHERE id = ?", 
                [photoID], 
                (err, result) => {
                    err ? console.log(err) : res.send(result)
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
}

// app.post("/update_profile", (req, res) => {
//     const {userID, username, status} = req.body
//     db.query("INSERT INTO profile (username, status, id) VALUES(?,?,?) ON DUPLICATE KEY UPDATE username=?, status=?",
//     [username, status, userID, username, status],
//     (err, result) => {
//         err ? console.log(err) : res.send(result)
//     })
// })

app.post("/empty_trash", verifyJWT, (req, res) => {
    const userID = req.userID
    db.query("SELECT photoKey FROM photos WHERE userID = ? AND trash = 1", 
    [userID], 
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            const sendDelRequest = result.map(photo => {
                const params = {
                    Bucket: "photos-photos",
                    Key: photo.photoKey
                }
                s3.deleteObject(params, (error, data) => {
                    if (error) {
                        console.log(error) 
                    } else {
                        db.query("DELETE FROM photos WHERE userID = ? AND trash = 1",
                        [userID],
                        (err, result) => {
                            err ? console.log(err) : res.send(result)
                        })
                    }
                })})
            }
        })
    })


app.post("/delete-account", verifyJWT, (req, res) => {
    const userID = req.userID
    const params = {
        Bucket: "photos-photos",
        Key: `/${userID}`
    }
    s3.deleteObject(params, (error, response) => {
        if (error) {
            console.log(error)
        } else {
            db.query("Delete FROM users WHERE id = ?", 
            [userID],
            (err, result) => {
                err ? res.send({error: "An error occurred"}) : res.send({success: "You have successfully deleted your account!"})
            })
        }
    })
})

app.listen(process.env.PORT || 3001, () => {
    console.log("Running...")
})
