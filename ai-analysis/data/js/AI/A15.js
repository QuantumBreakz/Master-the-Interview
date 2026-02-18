import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [form, setForm] = useState({
    name: '',
    price: ''
  })
  const [fruit, setFruit] = useState([])

  const handleForm = (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://127.0.0.1:8080/demo', form, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(response.data)
      getFruits()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const getFruits = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/data')
      setFruit(response.data)
    } catch (error) {
      console.error('Error fetching fruits:', error)
    }
  }

  useEffect(() => {
    getFruits()
  }, [])

  return (
    <div>
      <h2>Fruit Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={form.name} onChange={handleForm} />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" name="price" value={form.price} onChange={handleForm} />
        </div>
        <button type="submit">Add Fruit</button>
      </form>

      <div>
        <h2>Fruit Price</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {fruit.map((row, key) => (
              <tr key={key}>
                <td>{row.name}</td>
                <td>{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
