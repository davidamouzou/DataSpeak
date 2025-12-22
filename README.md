# DataSpeak

## Objectif

DataSpeak est une plateforme d'analyse de données conçue pour permettre aux utilisateurs de visualiser, manipuler et interpréter facilement de grands ensembles de données. Elle offre des outils puissants pour la transformation des données, la création de rapports dynamiques et la collaboration en temps réel.

## Roadmap

- **Phase 1** : Intégration des sources de données multiples (CSV, bases SQL, API)
- **Phase 2** : Développement des tableaux de bord interactifs
- **Phase 3** : Ajout des fonctionnalités de collaboration et partage
- **Phase 4** : Mise en place de l'analyse prédictive avec machine learning
- **Phase 5** : Optimisation des performances et déploiement cloud

## Architecture

DataSpeak est construite selon une architecture microservices :

- **Frontend** : Application React pour une interface utilisateur réactive et intuitive
- **Backend** : API RESTful en Node.js avec Express pour la gestion des données et la logique métier
- **Base de données** : MongoDB pour le stockage flexible des données
- **Services additionnels** : Microservices pour l'analyse et le traitement des données en Python

## Configuration

1. Cloner le dépôt :
   ```
   git clone https://github.com/username/dataspeak.git
   ```
2. Installer les dépendances backend :
   ```
   cd dataspeak/backend
   npm install
   ```
3. Installer les dépendances frontend :
   ```
   cd ../frontend
   npm install
   ```
4. Configurer les variables d’environnement dans un fichier `.env` à la racine du dossier backend :
   ```
   PORT=4000
   DB_URI=mongodb://localhost:27017/dataspeak
   JWT_SECRET=VotreSecretJWT
   ```
5. (Optionnel) Configurer les services Python dans le dossier `services` selon la documentation spécifique.

## Lancement

### Backend

Dans le dossier `backend` :

```
npm start
```

### Frontend

Dans le dossier `frontend` :

```
npm start
```

L’application sera accessible à l’adresse `http://localhost:4000`.

## Bonnes pratiques

- Utiliser des branches Git pour chaque fonctionnalité ou correction
- Écrire des tests unitaires et d’intégration pour garantir la qualité du code
- Documenter les API avec Swagger ou équivalent
- Respecter les conventions de codage définies dans le projet
- Effectuer des revues de code avant toute fusion dans la branche principale

Pour toute question ou contribution, veuillez contacter l’équipe de développement à contact@dataspeak.com.
