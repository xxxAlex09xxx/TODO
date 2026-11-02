// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './app/providers/AuthProvider';
import { LoginPage } from './pages/Login/LoginPage';
import { TodosPage } from './pages/TodosPage/TodosPage';
import { TodoDetailPage } from './pages/TodoDetailPage/TodoDetailPage'; 
import { ProtectedRoute } from './shared/ui/ProtectedRoute';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage/ResetPasswordPage';
import './style/global.scss';
import { useAppSelector } from './app/store/hooks';

function App() {
    const theme = useAppSelector((state) => state.theme.theme);

    return (
        // 👇 Вешаем класс на корневой div
        <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <TodosPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route
                            path="/todos/:id"
                            element={
                                <ProtectedRoute>
                                    <TodoDetailPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;