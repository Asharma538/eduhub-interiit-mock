// src/components/ToDoSidebar.tsx

import { createSignal, onMount } from "solid-js";
import axios from "axios";

interface Assignment {
  id: string;
  title: string;
  deadline?: string; // Optional property
}

interface ToDoList {
  id: string;
  withDeadline: Assignment[];
  withoutDeadline: Assignment[];
}

const ToDoSidebar = (): JSX.Element => {
  const [toDoLists, setToDoLists] = createSignal<ToDoList[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(true);

  const fetchToDoLists = async () => {
    try {
      const response = await axios.get("/api/todos"); // Adjust the endpoint based on your API
      setToDoLists(response.data.data); // Adjust based on your response structure
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch to-do lists.");
      setLoading(false);
    }
  };

  onMount(() => {
    fetchToDoLists();
  });

  return (
    <div class="w-64 bg-gray-100 h-full p-4 border-r">
      <h2 class="text-lg font-bold mb-4">To-Do List</h2>
      {loading() && <p>Loading...</p>}
      {error() && <div class="text-red-600">{error()}</div>}

      {toDoLists().map((toDo) => (
        <div key={toDo.id} class="mb-6">
          <h3 class="font-semibold text-md mb-2">To-Do ID: {toDo.id}</h3>
          
          <h4 class="font-semibold">With Deadline:</h4>
          <ul class="list-disc pl-5 mb-2">
            {toDo.withDeadline.length === 0 ? (
              <li>No assignments with deadlines</li>
            ) : (
              toDo.withDeadline.map((assignment) => (
                <li key={assignment.id}>
                  {assignment.title} - {assignment.deadline}
                </li>
              ))
            )}
          </ul>

          <h4 class="font-semibold">Without Deadline:</h4>
          <ul class="list-disc pl-5">
            {toDo.withoutDeadline.length === 0 ? (
              <li>No assignments without deadlines</li>
            ) : (
              toDo.withoutDeadline.map((assignment) => (
                <li key={assignment.id}>{assignment.title}</li>
              ))
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ToDoSidebar;
