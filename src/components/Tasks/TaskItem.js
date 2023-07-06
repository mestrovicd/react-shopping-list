import classes from "./TaskItem.module.css";

const TaskItem = (props) => {
    const removeTaskHandler = () => {
        props.onRemoveTask(props.taskId);
    };

    return (
        <li className={classes.task}>
            {props.children}
            <button
                className={classes.removeButton}
                onClick={removeTaskHandler}>
                x
            </button>
        </li>
    );
};

export default TaskItem;
