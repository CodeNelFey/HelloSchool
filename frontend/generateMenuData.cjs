const fs = require("fs");
const path = require("path");

function buildMenuFromDirectory(dirPath) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    return items
        .filter(item => !item.name.startsWith("."))
        .map(item => {
            const fullPath = path.join(dirPath, item.name);
            const title = path.basename(item.name, path.extname(item.name));
            if (item.isDirectory()) {
                return {
                    title,
                    children: buildMenuFromDirectory(fullPath),
                };
            } else {
                return { title };
            }
        });
}

function main() {
    const coursPath = path.join(__dirname, "public", "Cours");
    if (!fs.existsSync(coursPath)) {
        console.error("Le dossier 'Cours' n'existe pas.");
        process.exit(1);
    }

    const menuData = buildMenuFromDirectory(coursPath);

    const outputPath = path.join(__dirname, "src", "data", "menuData.json");

    if (!fs.existsSync(path.dirname(outputPath))) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(menuData, null, 2), "utf-8");

    console.log(`menuData.json généré dans ${outputPath}`);
}

main();
