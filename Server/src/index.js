const express = require('express');
const cookieParser = require('cookie-parser');
require("dotenv").config();

const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    db
} = require('../config/firebase');

const verifyToken = require("../middleware/index")

const auth = getAuth();
const app = express();
app.use(cookieParser());
app.use(express.json());
const port = 3000;

app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(402).json({
            email: "Email required",
            password: "Password required"
        });
    }
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            sendEmailVerification(auth.currentUser)
                .then(() => {
                    res.status(201).json({ message: "Verification email sent! User created successfully!" });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ error: "Error sending email verification" });
                });
        })
        .catch((error) => {
            const errorMessage = error.message || "An error occurred while registering user";
            res.status(500).json({ error: errorMessage });
        });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({
            email: "Email is required",
            password: "Password is required",
        });
    }
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const idToken = userCredential._tokenResponse.idToken
            if (idToken) {
                res.cookie('access_token', idToken, {
                    httpOnly: true
                });
                res.status(200).json({ message: "User logged in successfully", userCredential });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        })
        .catch((error) => {
            console.error(error);
            const errorMessage = error.message || "An error occurred while logging in";
            res.status(500).json({ error: errorMessage });
        });
});

app.post('api/resetpassword', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(422).json({
            email: "Email is required"
        });
    }
    sendPasswordResetEmail(auth, email)
        .then(() => {
            res.status(200).json({ message: "Password reset email sent successfully!" });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

app.post('/api/buildprofile',(req,res)=>{
    /*
        uuid,
        username,
        phone_number,
        email,
     */

    let userProfileData = {};
    userProfileData = req.body;

    console.log(userProfileData);

    db.collection('users')
        .doc(`${req.body.uuid}`)
        .set(userProfileData)
            .then(result=>{
                res.json(result);
            }).catch(err=>{
                res.json(err);
            });


});  

app.listen(port, () => console.log(`Server listening on port ${port}!`));