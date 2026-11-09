import { useTodos } from '@/entities/todo/model/useTodos';
import style from './ClearAllButton.module.scss';

export const ClearAllButton = () => {
    const { deleteAllTodos } = useTodos();

    const handleClick = () => {
        const isConfirmed = window.confirm('Вы уверены, что хотите удалить ВСЕ задачи?');
        if (isConfirmed) {
            deleteAllTodos();
        }
    };

    return (
        <button className={style.clearButton} onClick={handleClick}>
            Очистить всё
        </button>
    );
};