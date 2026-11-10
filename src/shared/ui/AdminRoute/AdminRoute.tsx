// src/shared/ui/AdminRoute/AdminRoute.tsx
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { LoadingState } from '../LoadingState/LoadingState';

export const AdminRoute = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <LoadingState />;

    // Если не админ — выкидываем на главную
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};