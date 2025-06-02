import { useState } from "react";
import MenuItemComponent, { MenuItem } from "./MenuItemComponent";

export default function Menu({
                                 menuData,
                                 onThemeSelect,
                             }: {
    menuData: MenuItem[];
    onThemeSelect: (path: string) => void;
}) {
    const [search, setSearch] = useState("");

    // Filtrer les éléments sans enfants visibles (seulement avec "cour")
    const flattenItems = (items: MenuItem[], parentPath = ""): MenuItem[] => {
        return items.flatMap(item => {
            const fullPath = parentPath ? `${parentPath}/${item.title}` : item.title;
            const hasOnlyCoursChild =
                item.children?.length === 1 && item.children[0].title.toLowerCase() === "cour";

            const hasCours = item.children?.some(child => child.title.toLowerCase() === "cour");

            if (hasCours && (!item.children || item.children.length <= 1)) {
                return [{ ...item, path: fullPath }];
            }

            const nested = item.children ? flattenItems(item.children, fullPath) : [];
            return [...nested];
        });
    };

    const allLeafItems = flattenItems(menuData);

    const filteredItems = search.length === 0
        ? []
        : allLeafItems.filter(item =>
            item.title.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div className="menu p-2">
            <input
                type="text"
                placeholder="Rechercher un thème..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 mb-3 border rounded"
            />

            {search.length > 0 ? (
                filteredItems.length > 0 ? (
                    <div className="searchList">
                        {filteredItems.map((item) => (
                            <button
                                onClick={() => onThemeSelect(item.path!)}
                            >
                                <div className="text-base">{item.title}</div>
                                <div className="classe">
                                    {item.path?.split("/")[0]}
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Aucun résultat</p>
                )
            ) : (
                menuData.map((item, idx) => (
                    <MenuItemComponent
                        key={idx}
                        item={item}
                        onThemeSelect={onThemeSelect}
                        parentPath=""
                    />
                ))
            )}
        </div>
    );
}
