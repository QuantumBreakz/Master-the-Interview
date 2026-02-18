import './App.css'
import { useState } from 'react'

function App() {
  const initialList = ['abcd', 'efgh', 'fgcd', 'abdr', 'efdr']
  const [list, setList] = useState(initialList)

  const filterList = (event) => {
    const searchTerm = event.target.value
    if (searchTerm) {
      const filtered = initialList.filter((item) => item.includes(searchTerm))
      setList(filtered)
    } else {
      setList(initialList)
    }
  }

  return (
    <div>
      <label>Search:</label>
      <input type="text" onChange={filterList} />
      {list.length > 0 ? (
        <ul>
          {list.map((elem, index) => (
            <li key={index}>{elem}</li>
          ))}
        </ul>
      ) : (
        <p>No items found.</p>
      )}
    </div>
  )
}

export default App
