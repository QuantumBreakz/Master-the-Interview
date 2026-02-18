import './App.css'
import { useState} from 'react'
import axios from 'axios'

function App()
{
    const [form, setForm]=useState({})
    const handleForm=(e)=>{
        setForm({
            ...form,
            [e.target.value]:e.target.name
        })
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        const response=await axios('http://127.0.0.1:8080/demo',{
            method:'POST',
            data:form,
            headers:{
                'Content-Type':'application/json'
            }
        })
        const data=await response.data;
        console.log(data)
        window.alert(data)
    }


    return(
        <div>
            <h2>User Details</h2>
            <form onSubmit={handleSubmit}>
                <span>User Name :</span>
                <input type='text' name='uname' onChange={handleForm}/><br></br>
                <span>Password :</span>
                <input type='text' name='pass' onChange={handleForm}/><br></br>
                <input type='submit'/>
            </form>
        </div>
    )

    
}

export default App