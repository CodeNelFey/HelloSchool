import React, { useEffect, useState } from 'react';
import {type Conversation, leaveConversation} from '../db/conversations';
import { getProfileImageUrlById } from '../db/account';
import UserSearchBar from './UserSearchBar';

interface DiscussionsProps {
    conversations: Conversation[];
    onSelect: (conv: Conversation) => void;
    onNewConversation?: (conv: Conversation) => void;
    onDeleteConversation?: (convId: number) => void;
    selectedConversationId?: number;
    currentUserId: number;
}

const Discussions: React.FC<DiscussionsProps> = ({
                                                     conversations,
                                                     onSelect,
                                                     onNewConversation,
                                                     onDeleteConversation,
                                                     currentUserId,
                                                 }) => {
    const [avatars, setAvatars] = useState<Record<number, string>>({});
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        conversation: Conversation | null;
    } | null>(null);

    useEffect(() => {
        async function fetchAvatars() {
            const userIdsToLoad = new Set<number>();

            conversations.forEach((conv) => {
                conv.participants?.forEach((p) => {
                    if (p.id !== currentUserId && !avatars[p.id]) {
                        userIdsToLoad.add(p.id);
                    }
                });
            });

            if (userIdsToLoad.size === 0) return;

            const results = await Promise.all(
                Array.from(userIdsToLoad).map(async (id) => {
                    const url = await getProfileImageUrlById(id);
                    return { id, url };
                })
            );

            setAvatars((prev) => {
                const newAvatars = { ...prev };
                results.forEach(({ id, url }) => {
                    newAvatars[id] = url;
                });
                return newAvatars;
            });
        }

        fetchAvatars();
    }, [conversations, currentUserId, avatars]);

    useEffect(() => {
        const handleClick = () => {
            setContextMenu(null);
        };

        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);

    const handleConversationCreated = (conv: Conversation) => {
        if (onNewConversation) {
            onNewConversation(conv);
        }
    };

    return (
        <div className="discussions" style={{ position: 'relative' }}>
            <UserSearchBar
                currentUserId={currentUserId}
                onConversationSelected={(conv) => {
                    onSelect(conv);
                    handleConversationCreated(conv);
                }}
            />
            {conversations.length === 0 && <p>Aucune conversation</p>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {conversations.map((conv) => {
                    const participants = conv.participants ?? [];
                    const otherParticipants = participants.filter(p => p.id !== currentUserId);

                    const title =
                        conv.name ||
                        (otherParticipants.length > 0
                            ? otherParticipants.map(p => `${p.firstName} ${p.lastName}`).join(', ')
                            : 'Conversation');

                    const avatarUrl =
                        otherParticipants.length > 0 && avatars[otherParticipants[0].id]
                            ? avatars[otherParticipants[0].id]
                            : "../../default-profile.png";

                    return (
                        <li
                            key={conv.id}
                            onClick={() => onSelect(conv)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                setContextMenu({
                                    x: e.clientX,
                                    y: e.clientY,
                                    conversation: conv
                                });
                            }}
                        >
                            <img
                                src={avatarUrl}
                                alt="avatar"
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    marginRight: 10,
                                    objectFit: 'cover',
                                }}
                            />
                            <span>{title}</span>
                        </li>
                    );
                })}
            </ul>

            {contextMenu && contextMenu.conversation && (
                <div
                    className="rightClicPopup"
                    style={{
                        top: contextMenu.y,
                        left: contextMenu.x,
                    }}
                >
                    <button
                        onClick={async () => {
                            if (contextMenu.conversation) {
                                const success = await leaveConversation(currentUserId, contextMenu.conversation.id);
                                if (success && onDeleteConversation) {
                                    onDeleteConversation(contextMenu.conversation.id);
                                }
                            }
                            setContextMenu(null);
                        }}
                    >
                        Supprimer la conversation
                    </button>
                </div>
            )}
        </div>
    );
};

export default Discussions;
