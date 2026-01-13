import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../stores/user';
import logo from '../assets/logo.png';

function HomeView() {
    const userStore = useUserStore();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const createUser = async () => {
        if (!name || !email) {
            setError('name and email are required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/register-user`,
                {
                    name,
                    email,
                }
            );

            userStore.setUser({
                userId: data.userId,
                name: data.name,
                email: data.email,
            });

            navigate('/chat');
        } catch (err) {
            setError('Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
                <img src={logo} alt="NeuraTalk logo" className="mx-auto w-24 h-24 mb-4" />
                <h1 className="text-2xl font-semibold mb-4 text-center">Welcome to NeuraTalk</h1>

                <input
                    type="text"
                    className="w-full p-2 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    className="w-full p-2 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    className="w-full p-2 mb-2 bg-blue-500 rounded-lg"
                    disabled={loading}
                    onClick={createUser}
                >
                    {loading ? 'logging in...' : 'Start Chatting'}
                </button>
                {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>
        </div>
    );
}

export default HomeView;

