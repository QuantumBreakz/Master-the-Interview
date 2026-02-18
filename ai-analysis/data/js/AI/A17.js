import './App.css'
import axios from 'axios'
import { useState } from 'react'

function App() {
  const [form, setForm] = useState({
    uname: '',
    pass: ''
  })

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
      const data = response.data
      console.log('Success:', data)
      window.alert(data)
    } catch (error) {
      console.error('Submission failed:', error)
      window.alert('Error submitting form.')
    }
  }

  return (
    <div className="App">
      <h2>Personal Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="text"
            name="uname"
            value={form.uname}
            onChange={handleForm}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="pass"
            value={form.pass}
            onChange={handleForm}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default App
