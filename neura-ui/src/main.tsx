import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './style.css';

createRoot(document.getElementById('app')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);

