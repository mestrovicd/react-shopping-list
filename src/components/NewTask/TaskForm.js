import { useRef } from "react";

import classes from "./TaskForm.module.css";

const TaskForm = (props) => {
    const taskInputRef = useRef();

    const submitHandler = (event) => {
        event.preventDefault();

        const enteredValue = taskInputRef.current.value;

        if (enteredValue.trim().length > 0) {
            props.onEnterTask(enteredValue);
            taskInputRef.current.value = ""; // Clear the input field
        }
    };

    return (
        <form className={classes.form} onSubmit={submitHandler}>
            <input
                type="text"
                ref={taskInputRef}
                placeholder="Upiši ovdje..."
            />
            <button>{props.loading ? "Šaljem..." : "Dodaj"}</button>
        </form>
    );
};

export default TaskForm;
