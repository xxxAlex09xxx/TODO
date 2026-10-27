// app/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './app/providers/AuthProvider';
import { LoginPage } from './pages/Login/LoginPage';
import { TodosPage } from './pages/TodosPage/TodosPage';
//import { TodoDetailPage } from './pages/TodoDetailPage/TodoDetailPage';
import { ProtectedRoute } from './shared/ui/ProtectedRoute';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage/ResetPasswordPage';
import './style/global.scss';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div >
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
                  
                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;