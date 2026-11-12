// src/entities/todo/ui/TodoState.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TodoState } from './TodoState';

describe('TodoState', () => {
    it('отображает правильную статистику', () => {
        render(<TodoState total={10} completed={3} active={7} />);

        // 👇 Ищем текст на экране (как видит пользователь)
        expect(screen.getByText(/Всего: 10/i)).toBeInTheDocument();
        expect(screen.getByText(/✅ Выполнено: 3/i)).toBeInTheDocument();
        expect(screen.getByText(/⏳ Осталось: 7/i)).toBeInTheDocument();
    });
});