import { useState, useEffect } from 'react'
import { fetchTodos } from './api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState(""); 

  useEffect (() => {
    fetch("http://localhost:5000/todos")
    .then((res) => res.json())
    .then((data) => setTodos(data))
    .catch((err) => console.error(err))
  }, []);

  const handleAddTodo = async () => {
  if (!newTodo.trim()) return; 

  try {
    const response = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo }),
    });

    if (!response.ok) throw new Error("Erreur ajout todo");

    const createdTodo = await response.json();

    setTodos([...todos, createdTodo]); 
    setNewTodo(""); 
  } catch (err) {
    console.error(err);
  }
};

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }); 
    
    if (!response.ok) throw new Error("Erreur supprimer todo");
     
    setTodos(
        todos.filter(todo => todo.id !== id)
    );

  } catch (err) {
    console.error(err);
  }

  };

  const handleToggleTodo = async (todo) => {
  try {
    const response = await fetch(
      `http://localhost:5000/todos/${todo.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: todo.completed === 1 ? 0 : 1,
        }),
      }
    );

    if (!response.ok) throw new Error("Erreur modification");

    const updatedTodo = await response.json();

    setTodos(todos.map((prevTodos) =>
        prevTodos.id === updatedTodo.id ? updatedTodo : prevTodos
      )
    );
  } catch (err) {
    console.error(err);
  }
};

  return (
  <div>
        <h1 className= "text-4xl text-blue-600">My to do list</h1>
        <ul className="text-blue-600">
          {todos.map((todo) => (
          <li
              key={todo.id}
              className="flex items-center gap-2"
          >
            <input
              type="checkbox"
              checked={todo.completed === 1}
              onChange={() => 
                handleToggleTodo(todo)}
            />

            <span>
              {todo.title}
            </span>

            <button
            className= "bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => handleDeleteTodo(todo.id)}>
             Delete
            </button>
          </li>
          ))}
        </ul>

        <div className= "flex gap-2 mb-4">
        <input 
        type="text"
        className="border p-2 flex-1 rounded"
        placeholder="Add a to do"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        />
        <button 
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleAddTodo}>
          Add
        </button>
        </div>

  </div>
)}
export default App;
