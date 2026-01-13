import { useState } from 'react';

interface ChatInputProps {
    onSend: (message: string) => void;
}

function ChatInput({ onSend }: ChatInputProps) {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if (!message.trim()) return;
        onSend(message);
        setMessage('');
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="p-4 bg-gray-800 flex">
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={handleKeyUp}
                placeholder="Send a message"
                type="text"
                className="flex-1 p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
            />
            <button className="ml-2 px-4 py-2 bg-blue-500 rounded-lg" onClick={sendMessage}>
                Send
            </button>
        </div>
    );
}

export default ChatInput;

