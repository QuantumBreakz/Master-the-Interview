// human-style React todo
// minimal comments

import React,{useState} from 'react';

function Todo({todo,toggle}){
 return (
  <li style={{textDecoration:todo.completed?'line-through':'none'}}>
   {todo.text} <button onClick={()=>toggle(todo.id)}>Toggle</button>
  </li>
 );
}

export default function App(){
 const [todos,setTodos]=useState([{id:1,text:'Learn React',completed:false},{id:2,text:'Build project',completed:false}]);
 const [inpt,setInpt]=useState('');

 function addTodo(){
  if(!inpt.trim()) return;
  setTodos([...todos,{id:Date.now(),text:inpt,completed:false}]);
  setInpt('');
 }

 function toggleComplete(id){
  setTodos(todos.map(t=>t.id===id?{...t,completed:!t.completed}:t));
 }

 return(
  <div>
   <h2>Todo App</h2>
   <input type="text" value={inpt} onChange={e=>setInpt(e.target.value)} placeholder="Add todo"/>
   <button onClick={addTodo}>Add</button>
   <ul>
    {todos.map(t=><Todo key={t.id} todo={t} toggle={toggleComplete}/>)}
   </ul>
  </div>
 );
}
