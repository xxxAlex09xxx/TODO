export interface Todo {
    id: number; // 👈 Сервер возвращает число!
    title: string;
    description: string;
    completed: boolean;
    user_id: number;
    created_at: string;
}
export type TaskFilter = 'all' | 'active' | 'completed';
