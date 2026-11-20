import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


const USERS_KEY = ['users'];

export const useUsers = () => {

    const queryClient = useQueryClient();

    const {
        data,
        isLoading: loading,
        error: queryError,
    } = useQuery({
        queryKey: [...USERS_KEY],
        queryFn:  fetchUsers,
        
    });
    const users = data?.users ?? [];

    const error = queryError?.message ??null;

    return {
        users,
        loading,
        error,

    }
}