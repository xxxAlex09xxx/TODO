// src/pages/TodoDetailPage/TodoDetailPage.tsx
import { useParams } from 'react-router-dom';
import { TodoDetailWidget } from '@/widgets/todo-detail';

const TodoDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const todoId = Number(id);


    
    return <TodoDetailWidget todoId={todoId}  />;
};

export default TodoDetailPage;