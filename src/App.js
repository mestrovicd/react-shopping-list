import React, { useEffect, useState } from "react";

import Tasks from "./components/Tasks/Tasks";
import NewTask from "./components/NewTask/NewTask";

function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                "https://react-tasks-c0e93-default-rtdb.firebaseio.com/shop.json"
            );

            if (!response.ok) {
                throw new Error("Greška!");
            }

            const data = await response.json();

            const loadedTasks = [];

            // Create a set to track duplicate task texts
            const duplicateTexts = new Set();

            for (const taskKey in data) {
                const task = data[taskKey];
                if (!duplicateTexts.has(task.text)) {
                    loadedTasks.push({ id: taskKey, text: task.text });
                    duplicateTexts.add(task.text);
                }
            }

            setTasks(loadedTasks);
        } catch (err) {
            setError(err.message || "Something went wrong!");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const taskAddHandler = async (task) => {
        console.log("taskAddHandler called");
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                "https://react-tasks-c0e93-default-rtdb.firebaseio.com/shop.json",
                {
                    method: "POST",
                    body: JSON.stringify({ text: task.text }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Zahtjev neuspješan!");
            }

            const data = await response.json();
            const createdTask = { id: data.name, text: task.text };

            const duplicateTask = tasks.find((t) => t.text === task.text);
            if (duplicateTask) {
                const updatedTasks = tasks.filter(
                    (t) => t.id !== duplicateTask.id
                );
                setTasks(updatedTasks);
            }

            setTasks((prevTasks) => [...prevTasks, createdTask]);
        } catch (err) {
            setError(err.message || "Something went wrong!");
        }
        setIsLoading(false);
    };

    const taskRemoveHandler = async (taskId) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://react-tasks-c0e93-default-rtdb.firebaseio.com/shop/${taskId}.json`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Zahtjev neuspješan!");
            }

            setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== taskId)
            );
        } catch (err) {
            setError(err.message || "Something went wrong!");
        }
        setIsLoading(false);
    };

    const removeAllTasksHandler = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                "https://react-tasks-c0e93-default-rtdb.firebaseio.com/shop.json",
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Zahtjev neuspješan!");
            }

            setTasks([]);
            removeDuplicatesHandler();
        } catch (err) {
            setError(err.message || "Something went wrong!");
        }
        setIsLoading(false);
    };

    const removeDuplicatesHandler = async (newTaskText) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                "https://react-tasks-c0e93-default-rtdb.firebaseio.com/shop.json"
            );

            if (!response.ok) {
                throw new Error("Zahtjev neuspješan!");
            }

            const data = await response.json();

            const duplicateTasks = [];

            for (const taskKey in data) {
                if (data[taskKey].text === newTaskText) {
                    duplicateTasks.push(taskKey);
                }
            }

            const removeTasksPromises = duplicateTasks.map(async (taskId) => {
                const removeResponse = await fetch(
                    `https://react-tasks-c0e93-default-rtdb.firebaseio.com/shop/${taskId}.json`,
                    {
                        method: "DELETE",
                    }
                );
                if (!removeResponse.ok) {
                    throw new Error("Zahtjev neuspješan!");
                }
            });

            await Promise.all(removeTasksPromises);

            fetchTasks();
        } catch (err) {
            setError(err.message || "Something went wrong!");
        }
        setIsLoading(false);
    };

    return (
        <React.Fragment>
            <NewTask onAddTask={taskAddHandler} />
            <Tasks
                items={tasks}
                loading={isLoading}
                error={error}
                onFetch={fetchTasks}
                onRemoveTask={taskRemoveHandler}
                onRemoveAllTasks={removeAllTasksHandler}
            />
        </React.Fragment>
    );
}

export default App;
