const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require("dotenv").config();

const {collection, getDocs, count} = require('firebase/firestore');
const {getUser, listAllUsers,createUser,countUsers,getAcceptedRequests,getWorkers }= require("./manage_users")

const verifyToken = require("../middleware/index");
const cors = require("cors")
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ limit: '50mb' }));
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
            res.status(500).json({ error });
        });
});

app.get('/admin/countusers', (req,res)=>{
    countUsers()
    .then((count) => {
        res.json( count);
        })
    .catch((error) => {
      console.error(error)
            })
  });


  app.get('/admin/getworkers', async (req, res) => {
    try {
      const { workers, count } = await getWorkers();
      res.json({ workers, count });
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch workers' });
    }
  });
app.get('/admin/user/:uid', async (req, res) => {
    const { uid } = req.params;
    console.log(uid);
    try {
      const userData = await getUser(uid);
      if (userData) {
        res.json(userData);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/admin/getworkers', async (req, res) => {
    try {
      const workers = await getWorkers();
      res.json(workers);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch workers' });
    }
  });

  app.get('/admin/acceptedRequests', async (req, res) => {
    try {
      const { acceptedRequests, totalAcceptedRequests } = await getAcceptedRequests();
      res.json({ acceptedRequests, totalAcceptedRequests });
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).json({ error: 'Failed to retrieve accepted requests' });
    }
  });
  
  app.post('/admin/createuser', async (req, res) => {
    const userData = req.body;
  
    try {
      const result = await createUser(userData);
      if (result.success) {
        res.status(201).json({ message: 'User created successfully', uid: result.uid });
      } else {
        res.status(500).json({ error: result.error });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.post('/api/resetpassword', (req, res) => {
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

app.post('/api/buildprofile', (req, res) => {
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
        .doc('Workers')
        .set(userProfileData)
        .then(result => {
            res.json(result);
        }).catch(err => {
            res.json(err);
        });


});

app.post('/api/linkphone', (req, res) => {
    let phoneNumber = req.body.phoneNumber;
});

app.get('/api/getusers', (req, res) => {
    let users = [];
    getDocs(collection(FIRESTORE_DB, 'Users'))
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                let uid = doc.id
                users.push({uid , ...doc.data()});
                console.log(doc.id,'=>',doc.data());
            })
            res.json(users);
        }).catch(err=>{
            console.error(err);
            res.send(err);
        })
});
// sends Expo Push Token to document
app.post('/api/expoPushTokens', (req, res) => {
    const { token, userId } = req.body;
    if (!token || !userId) {
        return res.status(400).json({ error: "Token and userId are required" });
    }

    const userDoc = doc(FIRESTORE_DB, 'Users', userId);
    setDoc(userDoc, { expoPushToken: token }, { merge: true })
        .then(() => res.status(200).json({ message: "Expo push token saved successfully" }))
        .catch(error => res.status(500).json({ error: error.message }));
});
// Send Notification
app.post('/api/sendNotification', async (req, res) => {
    const { userId, message } = req.body;
    if (!userId || !message) {
        return res.status(400).json({ error: "UserId and message are required" });
    }

    try {
        const userDoc = doc(FIRESTORE_DB, 'Users', userId);
        const userSnap = await getDoc(userDoc);

        if (!userSnap.exists()) {
            return res.status(404).json({ error: "User not found" });
        }

        const expoPushToken = userSnap.data().expoPushToken;
        if (!expoPushToken) {
            return res.status(400).json({ error: "Expo push token not found for user" });
        }

        const expo = new Expo();
        const messages = [{
            to: expoPushToken,
            sound: 'default',
            body: message,
        }];

        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];

        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Error sending push notification" });
            }
        }

        res.status(200).json({ message: "Notification sent successfully", tickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => console.log(`Server listening on port ${port}!`));