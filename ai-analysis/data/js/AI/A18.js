const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// Configure MongoDB
mongoose.set('strictQuery', true)
async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/local')
    console.log("Database connected")
  } catch (error) {
    console.error("Database connection error:", error)
  }
}
main()

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  uname: String,
  pass: String
})
const User = mongoose.model('User', userSchema)

// Initialize Express App
const app = express()
app.use(cors())
app.use(express.json()) // Use built-in JSON parser

// Login Route
app.post('/demo', async (req, res) => {
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
    console.error("Login error:", error)
    return res.status(500).json("Internal Server Error")
  }
})

// Start Server
const PORT = 8080
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
