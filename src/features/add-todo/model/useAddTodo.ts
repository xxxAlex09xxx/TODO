import { useAppDispatch } from '../../../app/store/hooks';
import { addTodo } from '../../../entities/todo/model/slice';

export const useAddTodo = () => {
    const dispatch = useAppDispatch();
    return (title: string, description: string) => dispatch(addTodo({ title, description }));
};