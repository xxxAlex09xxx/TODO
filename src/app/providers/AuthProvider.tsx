// app/providers/AuthProvider.tsx
import {
    createContext,
    useContext,
    useState,
    useEffect,
   type ReactNode,
} from 'react';
import { refresh } from '../../shared/api/auth-refresh';
import { getMe, logout as logoutApi,type User } from '../../shared/api/auth';
import { setAccessToken } from '../../shared/api/auth-token';

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
}


const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ===== 3. Провайдер =====
export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        let cancelled = false; // 👈 защита от гонок при unmount

        const restoreSession = async () => {
            try {
                
                await refresh();
                const me = await getMe();

                if (!cancelled) {
                    setUser(me);
                }
            } catch {
                if (!cancelled) {
                    setUser(null);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        restoreSession();

        return () => {
            cancelled = true;
        };
    }, []);

    // 3.3. Logout
    const logout = async () => {
        await logoutApi();        
        setAccessToken(null);       
        setUser(null);              
    };

 
    return (
        <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// ===== 4. Хук для доступа =====
export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
};