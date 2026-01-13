import { create } from 'zustand';
import axios from 'axios';
import { useUserStore } from './user';

interface ChatMessage {
    message: string;
    reply: string;
}

interface FormattedMessage {
    role: 'user' | 'ai';
    content: string;
}

interface ChatState {
    messages: FormattedMessage[];
    isLoading: boolean;
    loadChatHistory: () => Promise<void>;
    sendMessage: (message: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    isLoading: false,

    loadChatHistory: async () => {
        const userId = useUserStore.getState().userId;
        if (!userId) return;

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/chat/${userId}`,
                { userId }
            );

            const formattedMessages = data.messages
                .flatMap((msg: ChatMessage): FormattedMessage[] => [
                    { role: 'user', content: msg.message },
                    { role: 'ai', content: msg.reply },
                ])
                .filter((msg: FormattedMessage) => msg.content);

            set({ messages: formattedMessages });
        } catch (err) {
            console.error('Error loading chat history', err);
        }
    },

    sendMessage: async (message: string) => {
        const trimmedMessage = message.trim();
        const userId = useUserStore.getState().userId;

        if (!trimmedMessage || !userId) return;

        // Add user message immediately
        set((state) => ({
            messages: [...state.messages, { role: 'user', content: trimmedMessage }],
        }));

        set({ isLoading: true });

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/chat`,
                { message: trimmedMessage, userId }
            );

            set((state) => ({
                messages: [...state.messages, { role: 'ai', content: data.reply }],
            }));
        } catch (err) {
            console.error('Error sending message', err);
            set((state) => ({
                messages: [...state.messages, { role: 'ai', content: 'Error sending message!!' }],
            }));
        } finally {
            set({ isLoading: false });
        }
    },
}));
