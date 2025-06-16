import React, { useEffect, useState, useRef } from 'react';
import { type Conversation, type Message, getMessages, sendMessage } from '../db/conversations';
import { io, type Socket } from 'socket.io-client';
import {sendMessageIcon} from "../assets/svg";

interface ChatProps {
    conversation: Conversation | null;
    currentUserId: number;
    onMessageSent: () => void;
}

const Chat: React.FC<ChatProps> = ({ conversation, currentUserId, onMessageSent }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!conversation) return;

        async function loadMessages() {
            const msgs = await getMessages(conversation!.id);
            setMessages(msgs);
        }
        loadMessages();

        // Setup socket connection if not done
        if (!socketRef.current) {
            socketRef.current = io('http://localhost:5000'); // adapte si autre URL
        }

        // Join room conversation
        socketRef.current.emit('joinConversation', conversation.id);

        // Listen new messages
        const handleNewMessage = (newMessage: Message) => {
            setMessages((prev) => [...prev, newMessage]);
        };
        socketRef.current.on('newMessage', handleNewMessage);

        // Cleanup on conversation change/unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leaveConversation', conversation.id);
                socketRef.current.off('newMessage', handleNewMessage);
            }
        };
    }, [conversation]);

    async function handleSend() {
        if (!input.trim() || !conversation) return;

        const sent = await sendMessage(conversation.id, currentUserId, input.trim());
        if (sent) {
            setInput('');
            // Pas besoin de reload, le socket reçoit le nouveau message
            onMessageSent();
        }
    }

    if (!conversation) {
        return <div style={{ padding: 20 }}>Sélectionnez une conversation</div>;
    }

    return (
        <div className="chat">
            <h3>
                {conversation.name || 'Discussion'}
            </h3>
            <div className="chatbox">
                {messages.length === 0 && <p>Aucun message</p>}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            marginBottom: '10px',
                            textAlign: msg.sender_id === currentUserId ? 'right' : 'left',
                            color: msg.sender_id === currentUserId ? 'var(--light-color)' : 'var(--dark-color)'
                        }}
                    >
                        <div
                            style={{
                                display: 'inline-block',
                                backgroundColor: msg.sender_id === currentUserId ? 'var(--primary-color)' : 'var(--primary-color-alpha)',
                                padding: '8px 12px',
                                borderRadius: 12,
                                maxWidth: '70%',
                            }}
                        >
                            <div>{msg.content}</div>
                            <div style={{
                                fontSize: 10,
                                color: msg.sender_id === currentUserId ? 'var(--dark-color-alpha)' : 'var(--primary-color-alpha)',
                                marginTop: 4 }}>
                                {new Date(msg.created_at).toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="messagebar">
                <input
                    type="text"
                    placeholder="Tapez un message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                    style={{ width: '80%', padding: '8px' }}
                />
                <button className="sendMessageButton" onClick={handleSend} style={{ padding: '8px 12px', marginLeft: 10 }}>
                    {sendMessageIcon({ size: 30, color: "currentColor" })}
                </button>
            </div>
        </div>
    );
};

export default Chat;
