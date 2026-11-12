import { Link } from 'react-router-dom';

const AdminPage = () => {
    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Админ-панель</h1>
            <p>Тут будет таблица пользователей (пока заглушка).</p>
            <Link to="/">← На главную</Link>
        </div>
    );
};
export default AdminPage;