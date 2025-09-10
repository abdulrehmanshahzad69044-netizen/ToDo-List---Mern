// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Replace <username>, <password>, and <cluster-url> with your Atlas details
const uri = "mongodb+srv://abdulrehman:arehman@clustertodo.ujbsvf7.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTodo";

// Connect to MongoDB Atlas
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas Connected!"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define Todo schema & model
const todoSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Welcome to MERN Todo API");
});

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new todo
app.post("/todos", async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
    });
    const savedTodo = await todo.save();
    res.json(savedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update todo (mark complete/incomplete)
app.put("/todos/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const path = require("path");

// Serve frontend build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
