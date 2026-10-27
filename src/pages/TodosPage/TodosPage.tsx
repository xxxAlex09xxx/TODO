// src/pages/TodosPage/TodosPage.tsx
import style from './TodosPage.module.scss';
import { TodoList } from '../../widgets/todo-list/TodoList';
import { AddTodoForm } from '../../features/add-todo/ui/AddTodoForm';
import { LogoutButton } from '../../features/logout/ui/LogoutButton';
import { TodoState } from '../../entities/todo/ui/TodoState';
import { TodoFilters } from '../../features/filter-todo/model/useFilterTodo';

export const TodosPage = () => {
    return (
        <div className={style.wrapper}>
            <div className={style.hero}>
                <div className={style.heroGrid}>
                    <div className={style.containerHed}>
                        <div className={style.header}>
                            <h1>T O D O</h1>
                        </div>
                        <AddTodoForm />
                        <TodoFilters/>
                    </div>

                    <div className={style.logoutWrapper}>
                        <LogoutButton /> {/* 👈 Кнопка выйти */}
                        <TodoState />    {/* 👈 Статистика */}
                    </div>
                </div>
            </div>

            <div className={style.container}>
                <div className={style.todoColumn}>
                    <TodoList />
                </div>
            </div>
        </div>
    );
};