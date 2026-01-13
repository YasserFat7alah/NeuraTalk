import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    userId: string | null;
    name: string | null;
    email: string | null;
    setUser: (data: { userId: string; name: string; email: string }) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            userId: null,
            name: null,
            email: null,
            setUser: (data) => set({
                userId: data.userId,
                name: data.name,
                email: data.email,
            }),
            logout: () => set({
                userId: null,
                name: null,
                email: null,
            }),
        }),
        {
            name: 'user-storage', // unique name for localStorage key
        }
    )
);
