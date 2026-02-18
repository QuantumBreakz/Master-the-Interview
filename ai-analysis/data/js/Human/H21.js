import './App.css'
import {useState,useEffect} from 'react'

function App()
{
  const [data,setData]=useState(null)

  const fetchData=async()=>{
    const response=await fetch('https://dummyjson.com/todos')
    const apiData=await response.json()
    setData(apiData['todos'])
  }

  useEffect(()=>{
    fetchData()
  },[])

  return(
    <div className='App'>
      {data&&<table>
        <tr>
          {
            Object.keys(data[0]).map((keys)=>{
              return <th>{keys}</th>
            })
          }
        </tr>
        {
          data.map((rowdata)=>{
            return <tr>
              {
                Object.values(rowdata).map((celldata)=>{
                  return <td>{celldata}</td>
                })
              }
            </tr>
          })
        }
        </table>}
    </div>
  )
}

export default App;