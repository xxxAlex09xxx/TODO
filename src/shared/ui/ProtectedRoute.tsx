import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { LoadingState } from './LoadingState/LoadingState';

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();


    if (isLoading) {
        return <LoadingState />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Всё ок — рендерим защищённую страницу.
    return <>{children}</>;
};