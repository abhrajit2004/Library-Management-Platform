require('dotenv').config();
const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const fetchUser = require('../middleware/fetchuser')

const JWT_SECRET = process.env.JWT_SECRET

router.post('/register', async (req, res) => {
    const body = req.body;

    const existingUser = await User.findOne({ email: body.email });

    if (existingUser) {
        return res.status(404).send({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);

    const securePassword = await bcrypt.hash(body.password, salt);

    const user = new User({
        name: body.name,
        email: body.email,
        password: securePassword,
        role: body.role
    });

    const newUser = await user.save();

    const data = {
        user: {
            id: newUser.id
        }
    }

    const authToken = jwt.sign(data, JWT_SECRET);

    res.json({ success: true, authToken, message: "User registered successfully" });
})

router.post('/login', async (req, res) => {

    const body = req.body;

    const user = await User.findOne({ email: body.email, role: body.role });

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
        return res.status(404).send({ message: "Invalid Password" });
    }

    const data = {
        user: {
            id: user.id
        }
    }

    const authToken = jwt.sign(data, JWT_SECRET);


    res.json({ success: true, authToken, message: "User logged in successfully", user });

})

router.post('/getuser', fetchUser, async (req, res) => {

    const body = req.body;

    const user = await User.findOne({ email: body.email, role: body.role });

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    res.json({ success: true, message: "User found", user });
})

module.exports = router