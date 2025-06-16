import React, { useEffect, useState } from 'react';
import { getUserConversations, type Conversation } from '../db/conversations';
import { getCurrentUser } from '../db/account';
import Discussions from './Discussions';
import Chat from './Chat';

const Messages: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        async function load() {
            const user = await getCurrentUser();
            if (!user) return;
            setCurrentUserId(user.id);

            const convs = await getUserConversations(user.id);
            setConversations(convs);
            if (convs.length > 0) setSelectedConversation(convs[0]);
        }

        load();
    }, []);

    // Fonction qui ajoute une nouvelle conversation si elle n'existe pas déjà
    const handleNewConversation = (newConv: Conversation) => {
        setConversations(prev => {
            if (prev.some(c => c.id === newConv.id)) return prev;
            return [newConv, ...prev];
        });
        setSelectedConversation(newConv);
    };

    return (
        <div className="messages">
            <Discussions
                conversations={conversations}
                onSelect={setSelectedConversation}
                onNewConversation={handleNewConversation}
                selectedConversationId={selectedConversation?.id}
                currentUserId={currentUserId ?? -1}
            />
            <Chat
                conversation={selectedConversation}
                currentUserId={currentUserId || -1}
                onMessageSent={() => {
                    // Tu peux gérer le rafraîchissement des messages ici si besoin
                }}
            />
        </div>
    );
};

export default Messages;
