import './App.css'
import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)

  const fetchData = async () => {
    try {
      const response = await fetch('https://dummyjson.com/todos')
      const apiData = await response.json()
      setData(apiData.todos)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (!data) {
    return <div className="App">Loading...</div>
  }

  if (data.length === 0) {
    return <div className="App">No data available.</div>
  }

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex}>{cell.toString()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
