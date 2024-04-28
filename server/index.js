const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./utils/db.js');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(5000, () => {
    console.log("Server is running on port 5000");
}
);

app.get('/', (req, res) => {
    res.send("Hello World");
})

// Your AccountSID and Auth Token from console.twilio.com
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);
app.post('/send-sms', async (req, res) => {
    const { phone, email, password } = req.body;
    try {
        const code = Math.floor(Math.random() * 9999) + 1000;
        await db.query('INSERT INTO users(phone,email,password) VALUES ($1,$2,$3) RETURNING *', [phone, email, password]);
        client.messages
            .create({
                body: 'Then Phone number verify code is ' + code,
                to: phone, // Text your number
                from: process.env.TWILLO_NUMBER , // From a valid Twilio number
            })
        // .then((message) => res.send(message.sid));
        const updatedUser = await db.query('UPDATE users SET type=$1,updatedat=$2 WHERE phone=$3 RETURNING *', ['verified', new Date(), phone]);
        console.log(updatedUser.rows[0]);
        res.json({ message: 'User created successfully', user: updatedUser.rows[0] });
    } catch (error) {
        console.log(error);
    }
}
);