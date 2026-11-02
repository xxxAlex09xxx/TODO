import { useAppSelector } from "@/app/store/hooks";

export const TodoState = () =>{
    const todos = useAppSelector((state) =>state.todos.todos)

    const total = todos.length;
    const completed = todos.filter(todo=> todo.completed).length;
    const active = total - completed;

    return (
        <div>
            <span>Всего{total} </span>
            <span>Вполнены{completed}</span>
            <span>Осталось{active}</span>
        </div>
    )
}