import { useState, useEffect } from "react";
import Menu from "./Menu";
import menuData from "../data/menuData.json";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";  // n'oublie pas d'importer le CSS KaTeX

export default function Cours() {
    const [selectedThemePath, setSelectedThemePath] = useState<string | null>(null);
    const [mdContent, setMdContent] = useState<string>("");

    useEffect(() => {
        if (!selectedThemePath) {
            setMdContent("");
            return;
        }

        const mdFilePath = `/Cours/${selectedThemePath}/cour/cour.md`;
        console.log("Chargement du markdown :", mdFilePath);

        fetch(mdFilePath)
            .then((res) => {
                if (!res.ok) throw new Error("Fichier markdown non trouvé");
                return res.text();
            })
            .then((text) => setMdContent(text))
            .catch((err) => {
                console.error(err);
                setMdContent("Erreur lors du chargement du contenu.");
            });
    }, [selectedThemePath]);

    return (
        <div>
            <Menu menuData={menuData} onThemeSelect={setSelectedThemePath} />

            <div className="cours-content prose max-w-none p-4">
                {!selectedThemePath && <h1>Choisissez un thème</h1>}
                {selectedThemePath && (
                    <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {mdContent}
                    </ReactMarkdown>
                )}
            </div>
        </div>
    );
}
