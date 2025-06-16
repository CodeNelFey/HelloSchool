import React, { useState, useEffect, useRef } from 'react';
import { searchUsers, getProfileImageUrlById, type User } from '../db/account';
import { createOrGetConversation, type Conversation } from '../db/conversations';

interface Props {
    currentUserId: number;
    onConversationSelected: (conversation: Conversation) => void;
}

const UserSearchBar: React.FC<Props> = ({ currentUserId, onConversationSelected }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [avatars, setAvatars] = useState<Record<number, string>>({});
    const lastQueryRef = useRef('');

    useEffect(() => {
        if (query.trim().length === 0) {
            setResults([]);
            setAvatars({});
            lastQueryRef.current = '';
            return;
        }

        lastQueryRef.current = query;

        const delayDebounce = setTimeout(async () => {
            const found = await searchUsers(query);

            if (lastQueryRef.current === query) {
                const sliced = found.slice(0, 5);
                setResults(sliced);

                // Charger les avatars pour les résultats
                const avatarsLoaded: Record<number, string> = {};
                await Promise.all(
                    sliced.map(async (user) => {
                        avatarsLoaded[user.id] = await getProfileImageUrlById(user.id);
                    })
                );
                setAvatars(avatarsLoaded);

            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    async function handleUserClick(user: User) {
        const conversation = await createOrGetConversation(currentUserId, user.id);
        if (conversation) {
            onConversationSelected(conversation);
            setQuery('');
            setResults([]);
            setAvatars({});
        }
    }

    return (
        <div className="user-search-bar">
            <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {results.length > 0 && (
                <ul className="search-results" style={{ listStyle: 'none', padding: 0 }}>
                    {results.map(user => (
                        <li
                            key={user.id}
                            onClick={() => handleUserClick(user)}
                        >
                            <img
                                src={avatars[user.id] || '../../default-profile.png'}
                                alt={`${user.firstName} ${user.lastName}`}
                            />
                            <span>{user.firstName} {user.lastName}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserSearchBar;
