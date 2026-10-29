import { useAppDispatch } from '../../../app/store/hooks';
import { toggleTodo } from '../../../entities/todo/model/slice';

export const useToggleTodo = () => {
    const dispatch = useAppDispatch();
    return (id: number, completed: boolean) => dispatch(toggleTodo({ id, completed }));
};