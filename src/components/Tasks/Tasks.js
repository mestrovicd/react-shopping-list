import { useState } from "react";
import Section from "../UI/Section";
import TaskItem from "./TaskItem";
import classes from "./Tasks.module.css";

const Tasks = (props) => {
    const [showModal, setShowModal] = useState(false);

    const removeTaskHandler = (taskId) => {
        props.onRemoveTask(taskId);
    };

    const removeAllTasksHandler = () => {
        setShowModal(true);
    };

    const cancelRemoveAllTasksHandler = () => {
        setShowModal(false);
    };

    const confirmRemoveAllTasksHandler = () => {
        setShowModal(false);
        props.onRemoveAllTasks();
    };

    let taskList = <h2>Popis je prazan!</h2>;

    if (props.items.length > 0) {
        taskList = (
            <ul>
                {props.items.map((task) => (
                    <TaskItem
                        key={task.id}
                        taskId={task.id}
                        onRemoveTask={removeTaskHandler}>
                        {task.text}
                    </TaskItem>
                ))}
            </ul>
        );
    }

    let content = taskList;
    let removeAllButton = null;

    if (props.error) {
        content = <button onClick={props.onFetch}>Pokušaj ponovno</button>;
    }

    if (props.loading) {
        content = "Učitavanje popisa...";
    }

    if (props.items.length > 0) {
        removeAllButton = (
            <button onClick={removeAllTasksHandler}>Obriši sve</button>
        );
    }

    return (
        <Section>
            <div className={classes.container}>
                {content}
                {removeAllButton}
                {showModal && (
                    <div className={classes.modal}>
                        <h3>Sigurno?</h3>
                        <button onClick={cancelRemoveAllTasksHandler}>
                            Zatvori
                        </button>
                        <button onClick={confirmRemoveAllTasksHandler}>
                            Da, obriši sve
                        </button>
                    </div>
                )}
            </div>
        </Section>
    );
};

export default Tasks;
