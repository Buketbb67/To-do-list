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
  
  return (
  <div>
        <h1 className= "text-4xl text-blue-600">My to do list</h1>
        <ul className= "text-blue-600">
          {todos.map((todo)=> (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
        <div className= "flex gap-2 mb-4">
        <input 
        type="text"
        className="border p-2 flex-1 rounded"
        placeholder="Nouvelle to do"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        />
        <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddTodo}>
          Ajouter
        </button>
        </div>

  </div>
)}
export default App;
