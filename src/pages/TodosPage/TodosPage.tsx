// src/pages/TodosPage/TodosPage.tsx
import { useState } from 'react'; // 👈 Добавили useState
import style from './TodosPage.module.scss';
import { TodoList } from '../../widgets/todo-list/TodoList';
import { AddTodoForm } from '../../features/add-todo/ui/AddTodoForm';
import { LogoutButton } from '../../features/logout/ui/LogoutButton';
import { TodoState } from '../../entities/todo/ui/TodoState';
import { TodoFilters } from '../../features/filter-todo/ui/TodoFilter';
import { Modal } from '../../shared/ui/Modal/Modal'; // 👈 Импортируем модалку

export const TodosPage = () => {
    // 👈 Создаем состояние для открытия/закрытия окна
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={style.wrapper}>
            <div className={style.hero}>
                <div className={style.heroGrid}>
                    <div className={style.containerHed}>
                        <div className={style.header}>
                            <h1>T O D O</h1>
                        </div>

                        {/* Кнопка, которая открывает модалку */}
                        <button
                            className={style.addButton}
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Добавить задачу
                        </button>

                        {/* Убрали AddTodoForm отсюда, он теперь внутри Modal */}

                        <TodoFilters />
                    </div>

                    <div className={style.logoutWrapper}>
                        <LogoutButton />
                        <TodoState />
                    </div>
                </div>
            </div>

            <div className={style.container}>
                <div className={style.todoColumn}>
                    <TodoList />
                </div>
            </div>

            {/* 👈 Само модальное окно */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Новая задача"
            >
                <AddTodoForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};