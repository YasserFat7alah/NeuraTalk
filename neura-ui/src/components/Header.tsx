import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/user';
import hLogo from '../assets/horizontal.png';

function Header() {
    const userStore = useUserStore();
    const navigate = useNavigate();

    const logout = () => {
        userStore.logout();
        navigate('/');
    };

    return (
        <div className="py-4 px-4 bg-gray-800 shadow-md flex justify-between items-center">
            <img src={hLogo} alt="NeuraTalk logo" className="w-30 h-8" />
            <h1 className="text-lg font-semibold hidden">Chat AI</h1>
            <button className="text-gray-400 hover:text-white" onClick={logout}>
                Logout
            </button>
        </div>
    );
}

export default Header;

