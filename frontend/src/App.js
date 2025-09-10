import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";  // import css

const API_URL = "http://localhost:5000/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    await axios.post(API_URL, { text: newTodo });
    setNewTodo("");
    fetchTodos();
  };

  const toggleTodo = async (id, completed) => {
    await axios.put(`${API_URL}/${id}`, { completed });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTodos();
  };

  return (
    <div className="container">
      <h1>Todo List (React + Node + MongoDB)</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new todo..."
        />
        <button className="add" onClick={addTodo}>Add</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "gray" : "#e6f1ff"
              }}
            >
              {todo.text}
            </span>
            <div>
              <button
                className="complete"
                onClick={() => toggleTodo(todo._id, !todo.completed)}
              >
                {todo.completed ? "Undo" : "Complete"}
              </button>
              <button
                className="delete"
                onClick={() => deleteTodo(todo._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
