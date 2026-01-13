import { createBrowserRouter } from 'react-router-dom';
import HomeView from '../views/HomeView';
import ChatView from '../views/ChatView';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomeView />,
    },
    {
        path: '/chat',
        element: <ChatView />,
    },
]);

