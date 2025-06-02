import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { arrow } from "../assets/svg";

export type MenuItem = {
    title: string;
    children?: MenuItem[];
    path?: string;
};

const MenuItemComponent = ({
                               item,
                               level = 0,
                               onThemeSelect,
                               parentPath = "",
                           }: {
    item: MenuItem;
    level?: number;
    onThemeSelect: (path: string) => void;
    parentPath?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Exclure les enfants nommés "cour"
    const visibleChildren = item.children?.filter(
        (child) => child.title.toLowerCase() !== "cour"
    ) || [];

    const hasChildren = visibleChildren.length > 0;

    const hasCoursFolder = item.children?.some(
        (child) => child.title.toLowerCase() === "cour"
    ) || false;

    const fullPath = parentPath ? `${parentPath}/${item.title}` : item.title;

    const onClickHandler = () => {
        if (hasCoursFolder) {
            onThemeSelect(fullPath); // Charge le cours
        } else if (hasChildren) {
            setIsOpen(!isOpen); // Déplie les sous-éléments
        }
    };

    return (
        <div className={`niveau-${level} ml-2 mt-1`}>
            <button
                className="text-left w-full flex justify-between items-center px-2 py-1 hover:bg-gray-200 rounded"
                onClick={onClickHandler}
            >
                <span>{item.title}</span>

                {hasChildren && !hasCoursFolder && (
                    <span
                        className="ml-2"
                        style={{
                            display: "inline-block",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                        }}
                    >
                        {arrow({ size: 20, color: "var(--primary-color)" })}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && hasChildren && !hasCoursFolder && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className={`niveau-enfants niveau-${level + 1} ml-3 border-l border-gray-300 pl-2`}>
                            {visibleChildren.map((child, idx) => (
                                <MenuItemComponent
                                    key={idx}
                                    item={child}
                                    level={level + 1}
                                    onThemeSelect={onThemeSelect}
                                    parentPath={fullPath}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MenuItemComponent;
