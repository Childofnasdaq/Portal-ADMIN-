const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nasdaqPortal', { useNewUrlParser: true, useUnifiedTopology: true });

// Define User Schema
const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    mentorID: String,
    profilePicture: String,
    robotName: String,
    licenseKey: String,
    subscriptionDuration: String,
});

const User = mongoose.model('User', UserSchema);

// Register Route
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const mentorID = generateMentorID();
    const newUser = new User({ email, password, mentorID });
    await newUser.save();
    res.status(201).send({ message: 'User registered', mentorID });
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.send({ success: true, mentorID: user.mentorID });
    } else {
        res.status(401).send({ success: false, message: 'Invalid credentials' });
    }
});

// Profile Update Route (Upload Profile Picture and Robot Name)
app.post('/updateProfile', async (req, res) => {
    const { email, profilePicture, robotName } = req.body;
    const user = await User.findOneAndUpdate({ email }, { profilePicture, robotName }, { new: true });
    if (user) {
        res.send({ success: true, user });
    } else {
        res.status(404).send({ success: false, message: 'User not found' });
    }
});

// Generate License Key Route
app.post('/generateLicense', async (req, res) => {
    const { email, subscriptionDuration } = req.body;
    const licenseKey = generateLicenseKey();
    const user = await User.findOneAndUpdate({ email }, { licenseKey, subscriptionDuration }, { new: true });
    if (user) {
        res.send({ success: true, licenseKey });
    } else {
        res.status(404).send({ success: false, message: 'User not found' });
    }
});

// Verify Credentials for App Access
app.post('/verify', async (req, res) => {
    const { email, mentorID, licenseKey } = req.body;
    const user = await User.findOne({ email, mentorID, licenseKey });
    if (user) {
        res.send({ authenticated: true, profilePicture: user.profilePicture, robotName: user.robotName });
    } else {
        res.send({ authenticated: false });
    }
});

function generateMentorID() {
    return 'M' + Math.floor(1000 + Math.random() * 9000);
}

function generateLicenseKey() {
    return 'LK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

app.listen(3000, () => console.log('Admin Portal running on port 3000'));
