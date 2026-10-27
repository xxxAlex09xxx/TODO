// app/components/TodoItem/TodoItem.tsx
import { Link } from 'react-router-dom';
import { SwipeButton } from '@freefugga/react-smooth-swipe-button';
import style from './TodoItem.module.scss';
import type { Todo } from '../model/types';

type TodoItemProps = {
    todo: Todo; 
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
};

export const TodoItem = ({  todo, onToggle, onDelete }: TodoItemProps) => {
    const {completed, id, title} = todo
    return (
        <li className={style.todoItem}>
            <Link to={`/todos/${id}`} className={style.itemLink}>
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={() => onToggle(id)}
                    onClick={(e) => {
                        e.preventDefault();  // 👈 не переходим по ссылке
                        e.stopPropagation(); // 👈 не даём клику всплыть
                    }}
                    className={style.todoCheckbox}
                    aria-label={completed ? 'Отметить как активную' : 'Отметить как выполненную'}
                />
                <span className={completed ? style.completed : ''}>
                    {title}
                </span>
            </Link>

            <div
                className={style.swipeWrapper}
                onClick={(e) => {
                    e.preventDefault();  // 👈 кнопка удаления не ведёт на страницу
                    e.stopPropagation();
                }}
            >
                <SwipeButton
                    label="Удалить"
                    trackColor="#676ae9"
                    height={32}
                    thumbSize={24}
                    thumbMargin={2}
                    onSwipeSuccess={() => onDelete(id)}
                />
            </div>
        </li>
    );
};