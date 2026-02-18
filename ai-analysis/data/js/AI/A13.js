import './App.css'
import { useState } from 'react'
import axios from 'axios'

function App() {
  const [formData, setFormData] = useState({
    uname: '',
    pass: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://127.0.0.1:8080/demo', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = response.data
      console.log(data)
      window.alert(data)
    } catch (error) {
      console.error('Submission error:', error)
      window.alert('An error occurred while submitting the form.')
    }
  }

  return (
    <div className="App">
      <h2>User Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User Name: </label>
          <input
            type="text"
            name="uname"
            value={formData.uname}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            name="pass"
            value={formData.pass}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default App
