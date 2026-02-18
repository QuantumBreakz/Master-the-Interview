import './App.css'
import axios from 'axios'
import { useState } from 'react'

function App(){
  const [form,setForm]=useState({})

  const handleForm=(e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios('http://127.0.0.1:8080/demo', {
      method: 'POST',
      data: form,
      headers: {
        "Content-Type": 'application/json'
      }
    });
    const data = response.data;
    console.log("Success:", data);
    window.alert(data);
  } catch (error) {
    console.error("Submission failed:", error);
    window.alert("Error submitting form.");
  }


  }
  return(
    <div>
      <h2>Personal Details</h2>
      <form onSubmit={handleSubmit}>
        <span>Email </span>
        <input type='text' name='uname' onChange={handleForm}/><br></br>
        <span>Password </span>
        <input type='password' name='pass' onChange={handleForm}/><br></br>
        <input type='submit'/>
      </form>
    </div>
  )
}

export default App