// src/pages/TodosPage/TodosPage.tsx
import { useState } from 'react';
import style from './TodosPage.module.scss';
import { TodoList } from '@/widgets/todo-list';
import { AddTodoForm } from '@/features/add-todo';
import { ClearAllButton } from '@/features/clear-todos';
import { TodoFilters } from '@/features/filter-todo';
import { LogoutButton, UserProfile } from '@/features/logout';
import { TodoState } from '@/entities/todo';
import { Modal } from '@/shared/ui';



const TodosPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={style.wrapper}>
            <div className={style.hero}>
                {/* 👇 ДВА СЛОЯ ДЛЯ КАРТИНОК */}
                <div className={`${style.heroBg} ${style.lightBg}`} />
                <div className={`${style.heroBg} ${style.darkBg}`} />

                <div className={style.heroGrid}>
                    <div>
                        <UserProfile/>
                    </div>
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
                        <TodoState />
                    </div>
                </div>
            </div>

            <div className={style.container}>
                <div className={style.todoColumn}>
                    <TodoList />
                </div>
                <div className={style.logoutWrapper}>
                    <ClearAllButton/>
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
export default TodosPage;