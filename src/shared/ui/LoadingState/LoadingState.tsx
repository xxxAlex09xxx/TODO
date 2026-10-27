import style from './LoadingState.module.scss';

interface LoadingStateProps {
    message?: string;
}

export const LoadingState = ({
    message = '⏳ Загрузка...',
}: LoadingStateProps) => {
    return (
        <div className={style.loading}>
            <p>{message}</p>
        </div>
    );
};