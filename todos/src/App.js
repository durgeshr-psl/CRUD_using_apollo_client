import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
    }
  }
`;

const ADD_TASKS = gql`
  mutation AddTask($title: String!, $description: String) {
    addTask(title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String!, $description: String) {
    updateTask(id: $id, title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

function App() {
  const [task, setTask] = useState({ title: "", description: "", id: "" });
  const { loading, error, data } = useQuery(GET_TASKS);
  const [addTask] = useMutation(ADD_TASKS, {
    refetchQueries: [{ query: GET_TASKS }],
  });
  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error:{error.message}</p>;

  const handleTasks = () => {
    if (task.id) {
      updateTask({
        variables: {
          id: task.id,
          title: task.title,
          description: task.description,
        },
      });
    } else {
      addTask({
        variables: {
          title: task.title,
          description: task.description,
        },
      });
    }

    setTask({ title: "", description: "", id: "" });
  };

  const handleDeleteTask = (id) => {
    deleteTask({ variables: { id } });
  };

  const handleEdit = (task) => {
    setTask(task);
  };

  return (
    <div className="App">
      <h1>Tasks</h1>
      <input
        type="text"
        placeholder="Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />
      <button onClick={handleTasks}>
        {task.id ? "Update Task" : "Add Task"}
      </button>
      <ul>
        {data.tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong>
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
