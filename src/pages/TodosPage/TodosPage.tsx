// src/pages/TodosPage/TodosPage.tsx
import { useState } from 'react';
import style from './TodosPage.module.scss';
import { TodoList } from '@/widgets/todo-list/ui/TodoList';
import { AddTodoForm } from '@/features/add-todo/ui/AddTodoForm';
import { LogoutButton } from '@/features/logout/ui/LogoutButton';
import { TodoState } from '@/entities/todo/ui/TodoState';
import { TodoFilters } from '@/features/filter-todo/ui/TodoFilter';
import { Modal } from '@/shared/ui/Modal/Modal';
import { ClearAllButton } from '@/features/clear-todos/ui/ClearAllButton'

export const TodosPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={style.wrapper}>
            <div className={style.hero}>
                {/* 👇 ДВА СЛОЯ ДЛЯ КАРТИНОК */}
                <div className={`${style.heroBg} ${style.lightBg}`} />
                <div className={`${style.heroBg} ${style.darkBg}`} />

                <div className={style.heroGrid}>
                    <div className={style.containerHed}>
                        <div className={style.header}>
                            <h1>T O D O</h1>
                        </div>

                        <button
                            className={style.addButton}
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Добавить задачу
                        </button>

                        <TodoFilters />
                    </div>

                    <div className={style.logoutWrapper}>
                        <LogoutButton />
                        <ClearAllButton/>
                        <TodoState />
                    </div>
                </div>
            </div>

            <div className={style.container}>
                <div className={style.todoColumn}>
                    <TodoList />
                </div>
            </div>

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