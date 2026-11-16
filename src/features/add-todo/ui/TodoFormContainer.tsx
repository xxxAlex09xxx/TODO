// src/features/add-todo/ui/TodoFormContainer.tsx
import { useTodos } from '@/entities/todo';
import { useTodo } from '@/entities/todo';
import { TodoForm } from './TodoForm';

interface TodoFormContainerProps {
    mode: 'create' | 'edit';
    todoId?: number; // нужен только для edit
    initialValues?: { title: string; description: string }; // нужен только для edit
    onSuccess: () => void;
    onCancel: () => void;
}

export const TodoFormContainer = ({
    mode,
    todoId,
    initialValues,
    onSuccess,
    onCancel,
}: TodoFormContainerProps) => {
    // 👇 Всегда вызываем оба хука (React требует безусловный вызов)
    const { addTodo } = useTodos();
    const { updateTodo } = useTodo(mode === 'edit' && todoId ? todoId : 0);

    const handleSubmit = ({ title, description }: { title: string; description: string }) => {
        if (mode === 'create') {
            addTodo(title, description); // 👈 Создаем
        } else {
            updateTodo(title, description); // 👈 Обновляем
        }
        onSuccess();
    };

    return (
        <TodoForm
            mode={mode}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onCancel={onCancel}
        />
    );
};