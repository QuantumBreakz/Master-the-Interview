const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// Connect to MongoDB
mongoose.set('strictQuery', true)
async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/local')
    console.log("Database connected successfully")
  } catch (error) {
    console.error("Database connection error:", error)
  }
}
main()

// Define Schema and Model
const fruitSchema = new mongoose.Schema({
  name: String,
  price: Number
})
const Fruit = mongoose.model('Fruit', fruitSchema)

// Initialize Express App
const app = express()
app.use(cors())
app.use(express.json()) // Use built-in JSON parser instead of bodyParser

// Route to add a new fruit
app.post('/demo', async (req, res) => {
  try {
    const fruit = new Fruit(req.body) // Directly pass request body to constructor
    const savedFruit = await fruit.save()
    console.log("Fruit saved:", savedFruit)
    res.json(savedFruit)
  } catch (error) {
    console.error("Error saving fruit:", error)
    res.status(500).json({ error: "Failed to save fruit" })
  }
})

// Route to get all fruits
app.get('/data', async (req, res) => {
  try {
    const fruits = await Fruit.find({})
    res.json(fruits)
  } catch (error) {
    console.error("Error fetching fruits:", error)
    res.status(500).json({ error: "Failed to fetch fruits" })
  }
})

// Start Server
const PORT = 8080
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
