// AI-generated React component example
// Demonstrates state, props, and event handling

import React, { useState } from 'react';

/**
 * TodoItem component
 * Displays a single todo with completion toggle
 */
function TodoItem({ todo, toggleComplete }) {
  return (
    <li style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
      {todo.text}
      <button onClick={() => toggleComplete(todo.id)}>Toggle</button>
    </li>
  );
}

/**
 * TodoApp component
 * Main application managing a list of todos
 */
export default function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false }
  ]);
  const [input, setInput] = useState('');

  // Add new todo
  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo = { id: Date.now(), text: input, completed: false };
    setTodos([...todos, newTodo]);
    setInput('');
  };

  // Toggle completion status
  const toggleComplete = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div>
      <h2>Todo App</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add new todo"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} toggleComplete={toggleComplete} />
        ))}
      </ul>
    </div>
  );
}
