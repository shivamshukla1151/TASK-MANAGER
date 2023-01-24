const express = require("express");
const mongoose = require("mongoose");
//const { findById } = require("./model/Todo");
const Todo = require("./model/Todo");
const cors = require("cors");
const { findByIdAndUpdate } = require("./model/Todo");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);
const url = "mongodb://127.0.0.1:27017/Todo";
mongoose
  .connect(url, {
    //newUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database"))
  .catch(console.error);

app.get("/todo", async (req, res) => {
  const todo = await Todo.find();
  //res.send("hello");
  res.json(todo);
});

app.post("/todo/new", (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  //res.send("hey todo/new");
  todo.save();

  res.json(todo);
});

app.delete("/todo/delete/:id", async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);

  res.json({ result });
});

app.get("/todo/complete/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.complete = !todo.complete;

  todo.save();
  res.json(todo);
});

app.put("/todo/update/:id", async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, {
    text: req.body.text,
  });
  // todo.text = req.body.text;
  console.log("update", todo);
  todo.save();
  res.json(todo);
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Listening to post ${PORT}`);
});
