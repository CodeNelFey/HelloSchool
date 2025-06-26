const updates = [
    {
        date: '20 Juin 2025',
        title: 'Ajout des Flashcards',
        description: 'Tu peux maintenant créer des groupes de flashcards pour t\'entraner et meme utiliser celles des autres utilisateurs si ils le veulent bien.',
        tag: 'NEW'
    },
    {
        date: '11 Juin 2025',
        title: 'Ajout des comptes',
        description: 'Tu peux maintenant créer un compte et changer ta photo de profil ! Pour le moment, ça ne sert pas à grand-chose, mais ça ne saurait tarder.',
        tag: 'NEW'
    },
    {
        date: '4 Juin 2025',
        title: 'Ajout de la page d’historique',
        description: 'Nouvelle page listant les mises à jour et ajouts récents.',
        tag: 'NEW'
    },
    {
        date: '3 Juin 2025',
        title: 'Amélioration de la sécurité des mots de passe',
        description: 'Ajout des règles de validation dynamiques en temps réel.',
        tag: 'ADD'
    },
    {
        date: '1 Juin 2025',
        title: 'Ajout du système de cycles de travail et de pause',
        description: 'Ce timer est conçu pour vous aider à gérer votre temps de travail et de pause de manière efficace. il est accesible dans le menu "Timer". de la navbar. Vous pouez le configurera votre guise. le nombre de cycles, la durée de travail et la durée de pause. Il est visible peut importe ce que vous faite a côté, utile si vous souhaitez consulter un cour ou un exercice en même temps.',
        tag: 'NEW'
    },
    {
        date: '31 Mai 2025',
        title: 'Création du projet HelloSchool',
        description: 'Lancement du projet HelloSchool, une plateforme éducative pour les étudiants.',
        tag: 'NEW'
    },
];

function UpdateHistory() {
    return (
        <div className="update-history">
            <h1>Historique des mises à jour</h1>
            <ul>
                {updates.map((update, index) => (
                    <li key={index} className="update-item">
                        <h2>{update.title}</h2>
                        <p className="date">{update.date}</p>
                        <p className="description">{update.description}</p>
                        <p className={update.tag + " tag"}>{update.tag}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UpdateHistory;
