import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const response = await fetch('https://dummy.restapiexample.com/api/v1/employees')
      const apiData = await response.json()
      setData(apiData.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return <div className="App">Loading...</div>
  }

  if (!data || data.length === 0) {
    return <div className="App">No data available.</div>
  }

  return (
    <div className="App">
      <Table>
        <TableHead>
          <TableRow>
            {Object.keys(data[0]).map((key) => (
              <TableCell key={key} style={{ fontWeight: "bold" }}>
                {key}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((rowData, index) => (
            <TableRow key={index}>
              {Object.values(rowData).map((cellData, cellIndex) => (
                <TableCell key={cellIndex}>{cellData}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default App
