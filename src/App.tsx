// src/App.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './app/providers/AuthProvider';
import { ProtectedRoute, AdminRoute, LoadingState } from '@/shared/ui';
import { useAppSelector } from '@/app/store'; 
import './style/global.scss';

// 👇 ЛЕНИВЫЕ ИМПОРТЫ (вместо обычных)
const LoginPage = lazy(() => import('./pages/Login/LoginPage'));
const TodosPage = lazy(() => import('./pages/TodosPage/TodosPage'));
const TodoDetailPage = lazy(() => import('./pages/TodoDetailPage/TodoDetailPage'));
const AdminPage = lazy(() => import('./pages/AdminPage/AdminPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage/ResetPasswordPage'));

function App() {
    const theme = useAppSelector((state) => state.theme.theme);

    return (
        <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
            <BrowserRouter>
                <AuthProvider>
                    {/* 👇 Оборачиваем Routes в Suspense */}
                    <Suspense fallback={<LoadingState message="Загрузка страницы..." />}>
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
                            <Route
                                path="/admin"
                                element={
                                    <AdminRoute>
                                        <AdminPage />
                                    </AdminRoute>
                                }
                            />
                        </Routes>
                    </Suspense>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;