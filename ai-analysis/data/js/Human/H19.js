import { Table, TableCell, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';
 
function App() { 
  const [data, setData] = useState(null); 
  const fetchData = async () => { 
    try { 
      const response = await fetch('https://dummy.restapiexample.com/api/v1/employees'); 
      const apiData = await response.json(); 
      setData(apiData['data']); 
    } catch (error) { 
      console.error(error); 
    } 
  } 
  
  useEffect(() => { 
    fetchData(); 
  }, []); 

  return ( 
    <div className="App"> 
      {data && (<Table> 
        <TableRow> 
          {Object.keys(data[0]).map((keys) => { 
            return (<TableCell style={{fontWeight:"bold"}}>{keys}</TableCell>) 
          })} 
        </TableRow> 
        {data.map((rowData) => { 
          return (<TableRow> 
            {Object.values(rowData).map((cellData) => { 
              return (<TableCell>{cellData}</TableCell>) 
            })} 
          </TableRow>) 
        })} 
</Table>)} 
</div> 
); 
} 
export default App;