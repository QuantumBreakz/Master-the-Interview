const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// Connect to MongoDB
mongoose.set('strictQuery', true)
async function main() {
    try {
        await mongoose.connect('mongodb://localhost:27017/local')
        console.log('MongoDB Connected')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
    }
}
main()

// Define User Schema and Model
const userSchema = new mongoose.Schema({
    uname: String,
    pass: String
})
const User = mongoose.model('user', userSchema)

// Initialize Express App
const server = express()
server.use(cors())
server.use(express.json()) // Built-in JSON parser

// Login Route
server.post('/demo', async (req, res) => {
    try {
        const { uname, pass } = req.body

        if (!uname || !pass) {
            return res.status(400).json("Username and password are required")
        }

        const user = await User.findOne({ uname })

        if (user && user.pass === pass) {
            return res.json("Login Success")
        } else {
            return res.status(401).json("Invalid Username or Password")
        }
    } catch (error) {
        console.error('Error during login:', error)
        return res.status(500).json("Internal Server Error")
    }
})

// Start Server
server.listen(8080, () => {
    console.log('Server started at http://localhost:8080')
})
