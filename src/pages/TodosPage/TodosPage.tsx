// src/pages/TodosPage/TodosPage.tsx
import { useState, useCallback } from 'react';
import style from './TodosPage.module.scss';
import { TodoList } from '@/widgets/todo-list';
import { TodoFormContainer } from '@/features/add-todo';
import { ClearAllButton } from '@/features/clear-todos';
import { TodoFilters } from '@/features/filter-todo';
import { LogoutButton, UserProfile } from '@/features/logout';
import { TodoStats } from '@/entities/todo';
import { Modal } from '@/shared/ui';



const TodosPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    return (
        <div className={style.wrapper}>
            <div className={style.hero}>
                {/* 👇 ДВА СЛОЯ ДЛЯ КАРТИНОК */}
                <div className={`${style.heroBg} ${style.lightBg}`} />
                <div className={`${style.heroBg} ${style.darkBg}`} />

                <div className={style.heroGrid}>
                    <div>
                        <UserProfile />
                    </div>
                    <div className={style.containerHed}>
                        <div className={style.header}>
                            <h1>T O D O</h1>
                        </div>

                        <button
                            className={style.addButton}
                            onClick={openModal}
                        >
                            + Добавить задачу
                        </button>

                        <TodoFilters />
                    </div>

                    <div className={style.logoutWrapper}>
                        <LogoutButton />
                        <TodoStats />
                    </div>
                </div>
            </div>

            <div className={style.container}>
                <div className={style.todoColumn}>
                    <TodoList />
                </div>
                <div className={style.logoutWrapper}>
                    <ClearAllButton />
                </div>
            </div>
v
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Новая задача"
            >
                <TodoFormContainer
                    mode="create"
                    onSuccess={closeModal}
                    onCancel={closeModal}
                />
            </Modal>
        </div>
    );
};
export default TodosPage;