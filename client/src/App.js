import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";

const url = "http://localhost:4000";
function App() {
  const [todos, setTodos] = useState([]);
  const [popps, setPopps] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState();

  useEffect(() => {
    GetTodos();

    console.log(todos);
  }, []);

  const GetTodos = async () => {
    const response = await fetch(url + "/todo");
    const data = await response.json();
    // console.log(data);
    setTodos(data);
  };

  const completeTodo = async (id) => {
    const response = await fetch(url + "/todo/complete/" + id);
    // console.log("response->", response);
    const data = await response.json();
    console.log("data->", data);
    setTodos(
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      })
    );
  };

  const addTask = async () => {
    const response = await fetch(url + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    });

    const data = await response.json();
    setTodos([...todos, data]);
    setPopps(false);
    setNewTodo("");
  };

  const deleteTodo = async (id) => {
    const response = await fetch(url + "/todo/delete/" + id, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log("delete executed", data);
    setTodos(todos.filter((todo) => todo._id !== data.result._id));
  };

  const editTodo = async () => {
    console.log("id", editId);
    const response = await fetch(url + "/todo/update/" + editId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    });
    const data = await response.json();
    console.log("UPDATE", data);
    setTodos(
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.text = newTodo;
          //console.log("Matched data", data);
        }
        setEdit(false);
        setNewTodo("");
        return todo;
      })
    );
  };

  return (
    <div className="App">
      <h1>Welcome Shivam</h1>
      <h4>Your Tasks</h4>

      <div className="todos">
        {todos.length > 0 ? (
          todos.map((todo) => {
            return (
              <div
                className={"todo" + (todo.complete ? " is-complete" : "")}
                key={todo._id}
              >
                <div
                  className="checkbox"
                  onClick={() => completeTodo(todo._id)}
                ></div>
                <div>{todo.text}</div>
                <div
                  className="update-todo"
                  key={todo._id}
                  onClick={() => {
                    setEditId(todo._id);
                    setEdit(true);
                  }}
                >
                  <FaEdit />
                </div>
                {edit ? (
                  <div className="popup">
                    <div className="closePopup" onClick={() => setEdit(false)}>
                      X
                    </div>
                    <div className="content">
                      <h3>Edit Task</h3>
                      <input
                        type="text"
                        className="add-todo-input"
                        onChange={(e) => setNewTodo(e.target.value)}
                        value={newTodo}
                      />
                      <div className="button" onClick={() => editTodo()}>
                        Update Task
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div
                  className="delete-todo"
                  onClick={() => deleteTodo(todo._id)}
                >
                  X
                </div>
              </div>
            );
          })
        ) : (
          <div>
            <h1>No Tasks Yet...!!!!</h1>
          </div>
        )}
      </div>

      <div className="addPopup" onClick={() => setPopps(true)}>
        +
      </div>
      {popps ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopps(false)}>
            X
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={() => addTask()}>
              Add Task
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
