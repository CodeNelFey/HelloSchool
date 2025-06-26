import { useState, useEffect, useRef } from 'react';
import type { FlashcardGroup } from '../db/flashcards';
import {
    getUserFlashcardGroups,
    getFlashcardGroupById,
    getPublicFlashcardGroups,
    createFlashcardGroup
} from '../db/flashcards';
import FlashcardGroupDetail from './FlashcardGroupDetail';

export default function FlashcardGroupsList() {
    const [groups, setGroups] = useState<FlashcardGroup[]>([]);
    const [publicGroups, setPublicGroups] = useState<FlashcardGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<FlashcardGroup | null>(null);
    const [readonly, setReadonly] = useState<boolean>(false);
    const [loadingGroup, setLoadingGroup] = useState(false);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        async function loadGroups() {
            try {
                const loadedGroups = await getUserFlashcardGroups();
                setGroups(loadedGroups);
            } catch (err) {
                console.error("Erreur chargement groupes perso", err);
            }

            try {
                const loadedPublicGroups = await getPublicFlashcardGroups();
                setPublicGroups(loadedPublicGroups);
            } catch (err) {
                console.error("Erreur chargement groupes publics", err);
            }
        }
        loadGroups();
    }, []);

    useEffect(() => {
        const ul = listRef.current;
        if (!ul) return;

        const onWheel = (e: WheelEvent) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                ul.scrollLeft += e.deltaY;
            }
        };

        ul.addEventListener('wheel', onWheel, { passive: false });
        return () => ul.removeEventListener('wheel', onWheel);
    }, []);

    async function handleCreateGroup() {
        setLoadingGroup(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Token manquant");

            const result = await createFlashcardGroup(
                token,
                "Nouveau groupe",
                "",
                false,
                []
            );

            if (result) {
                const newGroupWithDetails = await getFlashcardGroupById(token, result.groupId);
                setGroups(prevGroups => [...prevGroups, newGroupWithDetails]);
                setReadonly(false);
                setSelectedGroup(newGroupWithDetails);
            }
        } catch (err) {
            alert("Erreur lors de la création du groupe: " + err);
        } finally {
            setLoadingGroup(false);
        }
    }

    async function refreshSelectedGroup() {
        try {
            const token = localStorage.getItem('token');
            if (!token && !readonly) throw new Error("Token manquant");

            const refreshedGroup = await getFlashcardGroupById(token ?? "", selectedGroup!.id);
            setSelectedGroup(refreshedGroup);
        } catch (err) {
            console.error("Erreur lors du rafraîchissement du groupe", err);
        }
    }


    async function handleSelectGroup(groupId: number, isReadonly: boolean) {
        setLoadingGroup(true);
        try {
            const token = localStorage.getItem('token');
            if (!token && !isReadonly) throw new Error("Token manquant");

            const groupWithCards = await getFlashcardGroupById(token ?? "", groupId);
            setReadonly(isReadonly);
            setSelectedGroup(groupWithCards);
        } catch (err) {
            alert("Erreur lors du chargement du groupe: " + err);
        } finally {
            setLoadingGroup(false);
        }
    }

    if (selectedGroup) {
        return (
            <FlashcardGroupDetail
                group={selectedGroup}
                onBack={() => setSelectedGroup(null)}
                readonly={readonly}
                onRefresh={refreshSelectedGroup}
            />
        );
    }

    return (
        <div className="flashcardsGroupList">
            <h2>Mes groupes de flashcards</h2>
            {loadingGroup && <p>Chargement du groupe...</p>}
            <ul ref={listRef}>
                <li>
                    <button className="new" onClick={handleCreateGroup}>+</button>
                </li>
                {groups.map(group => (
                    <li key={group.id}>
                        <button onClick={() => handleSelectGroup(group.id, false)}>
                            {group.title}
                        </button>
                    </li>
                ))}
            </ul>

            <h2>Groupes publics</h2>
            <ul ref={listRef}>
                {publicGroups.map(group => (
                    <li key={group.id}>
                        <button onClick={() => handleSelectGroup(group.id, true)}>
                            {group.title}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}