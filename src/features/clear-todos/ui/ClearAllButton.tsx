import { useState } from 'react';
import { useTodos } from '@/entities/todo';
import { Modal } from '@/shared/ui';
import style from './ClearAllButton.module.scss';



export const ClearAllButton = () => {
    const { deleteAllTodos } = useTodos();

    const [isModalOpen, setIsOpenModal] = useState(false);

    const handleConfirm = () => {
        deleteAllTodos();
        setIsOpenModal(false);
    };

    return (
        <>
            <button
                className={style.clearButton}
                onClick={() => setIsOpenModal(true)}>
                Очистить все
            </button>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsOpenModal(false)}
                title="Удаление всех задач"
            >
                <p className={style.modalText}> Вы уверены, что хотите удалить <strong>ВСЕ</strong> задачи?
                    Это действие нельзя отменить. </p>

                <div className={style.actions}>
                    <button
                        className={style.cancelButton}
                        onClick={() => setIsOpenModal(false)}
                    >
                        Отмена
                    </button>
                    <button
                        className={style.confirmButton}
                        onClick={handleConfirm}
                    >
                        Да, удалить.
                    </button>
                </div>

            </Modal>
        </>
    )

}