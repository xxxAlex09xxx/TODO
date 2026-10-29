import { useAppDispatch } from '../../../app/store/hooks';
import { removeTodo } from '../../../entities/todo/model/slice';

export const useDeleteTodo = () => {
    const dispatch = useAppDispatch();
    return (id: number) => dispatch(removeTodo(id));
};