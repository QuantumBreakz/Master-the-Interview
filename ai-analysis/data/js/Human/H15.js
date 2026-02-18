import './App.css'
import {useState,useEffect} from 'react'
import axios from 'axios'

function App(){
  const [form,setForm]=useState({})
  const [fruit,setFruit]=useState([])

  const handleForm=(e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    const response=await axios('http://127.0.0.1:8080/demo',{
      method:'POST',
      data:JSON.stringify(form),
      headers:{
        'Content-Type':'application/json'
      }
    })
    const data=await response.data
    console.log(data)
    getFruits()
  }

  const getFruits=async()=>{
    const response=await axios('http://127.0.0.1:8080/data',{
      method:'GET'
    })
    const data=await response.data
    setFruit(data)
  }

  useEffect(()=>{
    getFruits()
  },[])

  return (
    <div>
      <h2>Fruit Details</h2>
      <form onSubmit={handleSubmit} className=''>
        <span>Name :</span>
        <input type='text' name='name' onChange={handleForm}/><br></br>
        <span>Price :</span>
        <input type='Number' name='price' onChange={handleForm}/><br></br>
        <input type='submit'/>
      </form>
      <div>
        <h2>Fruit Price</h2>
        <table>
          <tbody>
            {fruit.map((row,key)=>{
              return (<tr key={key}>
                <td> {row.name}   </td>
                <td> {row.price} </td>
              </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App