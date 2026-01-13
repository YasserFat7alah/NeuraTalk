import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/user';
import { useChatStore } from '../stores/chat';
import Header from '../components/Header';
import ChatInput from '../components/ChatInput';

// Format AI messages for better display
const formatMessage = (text: string) => {
    if (!text) return '';

    return text
        .replace(/\n/g, '<br>') // Preserve line breaks
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold text
        .replace(/\*(.*?)\*/g, '<i>$1</i>') // Italic text
        .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
        .replace(/(?:^|\n)- (.*?)(?:\n|$)/g, '<li>$1</li>') // Bullet points
        .replace(/(?:^|\n)(\d+)\. (.*?)(?:\n|$)/g, '<li>$1. $2</li>') // Numbered lists
        .replace(/<\/li>\n<li>/g, '</li><li>') // Ensure list continuity
        .replace(/<li>/, '<ul><li>') // Wrap in `<ul>`
        .replace(/<\/li>$/, '</li></ul>'); // Close the `<ul>`
};

function ChatView() {
    const userStore = useUserStore();
    const chatStore = useChatStore();
    const navigate = useNavigate();
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Ensure user is logged in
    useEffect(() => {
        if (!userStore.userId) {
            navigate('/');
        }
    }, [userStore.userId, navigate]);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        chatStore.loadChatHistory().then(() => {
            scrollToBottom();
        });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [chatStore.messages]);

    if (!userStore.userId) {
        return null;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {/* NavBar */}
            <Header />

            {/* Chat Messages */}
            <div
                id="chat-container"
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {chatStore.messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-start ${
                            msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                            className={`max-w-xs px-4 py-2 rounded-lg md:max-w-md ${
                                msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-white'
                            }`}
                        />
                    </div>
                ))}

                {chatStore.isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                            <span className="animate-pulse">AI is typing ....</span>
                        </div>
                    </div>
                )}
            </div>

            {/* chat input field */}
            <ChatInput onSend={chatStore.sendMessage} />
        </div>
    );
}

export default ChatView;

