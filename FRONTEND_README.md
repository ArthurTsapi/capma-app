# CaPMA Certification PME - Frontend Angular 17+

Plateforme SaaS complète de certification professionnelle en gestion de projet pour la Cameroon Project Management Association (CaPMA).

## 🏗️ Architecture de l'Application

```
src/app/
├── core/                          # Services, modèles, gardes
│   ├── models/
│   │   └── certification.model.ts  # Interfaces TypeScript
│   ├── services/
│   │   ├── certification-data.service.ts  # Données de certification
│   │   └── application.service.ts        # Gestion des candidatures
│   └── guards/
├── shared/                        # Composants réutilisables
│   └── components/
│       ├── navbar.component.ts
│       ├── footer.component.ts
│       ├── stepper.component.ts
│       ├── certification-card.component.ts
│       └── status-badge.component.ts
└── pages/                         # Vues principales
    ├── home.component.ts          # Landing page
    ├── apply.component.ts         # Formulaire de candidature
    └── dashboard.component.ts     # Tableau de bord candidat
```

## 🎨 Charte Graphique (Tailwind CSS)

Couleurs personnalisées CaPMA configurées dans `tailwind.config.js`:

| Couleur | Code | Utilisation |
|---------|------|-------------|
| **Blue (Principal)** | `#1E68B3` | Titres, Navbar, Éléments dominants |
| **Orange (Accentué)** | `#E87722` | Boutons secondaires, Badges |
| **Navy (Fond Sombre)** | `#0B192C` | Hero Banner, Footer |
| **Light Grey** | `#F8FAFC` | Fonds de cartes, Dashboard |
| **Success Green** | `#10B981` | Statuts validés, Indicateurs |

## 📋 Pages Développées

### 1. **Page d'Accueil (`/`)**
- **Hero Section**: Présentation avec badge, titre, sous-titre et CTA
- **4 Niveaux de Certification**: Cartes comparatives avec détails tarifs/prérequis
- **7 Étapes du Processus**: Grille illustrant le parcours candidat
- **Centres Agréés**: Affichage de tous les centres avec leurs caractéristiques
- **Section Pourquoi CaPMA**: Avantages de la certification

### 2. **Formulaire de Candidature (`/apply/:level`)**
- **Formulaire Réactif**: Avec validation FormBuilder
- **Champs Personnels**: Prénom, Nom, Email, Téléphone, Ville
- **Sélection Centre Agréé**: Dropdown avec tous les centres
- **Téléversement Documenté**: CV, Diplômes, CNI/Passeport, Attestation d'expérience
- **Drag & Drop**: Interface intuitive pour l'upload

### 3. **Dashboard Candidat (`/dashboard/:id`)**
- **Carte Profil**: Affichage des informations candidat
- **Badge Statut**: État actuel de la candidature
- **Stepper de Progression**: Visualisation des 7 étapes
- **Module Paiement**: 
  - Affichage du montant
  - Choix des modes: MTN MoMo, Orange Money, Virement bancaire
- **Module Convocation & Examen**:
  - Téléchargement PDF
  - Accès simulateur QCM

## 🔧 Configuration Techniques

### Dépendances Installées
```bash
npm install -D tailwindcss postcss autoprefixer
```

### Fichiers de Configuration
- **tailwind.config.js**: Palette de couleurs personnalisées CaPMA
- **postcss.config.js**: Configuration PostCSS
- **styles.css**: Directives Tailwind + composants personnalisés

### Composants Angular 17+ Standalone
Tous les composants utilisent l'API standalone :
- Pas de NgModule nécessaire
- Imports explicites dans chaque composant
- RxJS avec Observables pour la réactivité

## 🚀 Commandes de Développement

```bash
# Démarrer le serveur de développement
npm start

# Compiler l'application
npm run build

# Lancer les tests
npm run test

# Build avec SSR (Server-Side Rendering)
npm run build -- --configuration production
```

## 📊 Modèles de Données

### CertificationLevel
- 4 niveaux: Foundation, Practitioner, Professional, Master
- Détails complets: tarifs, prérequis, format d'examen

### CandidateApplication
- Suivi complet de la candidature
- Statuts: submitted → under_review → approved → paid → convoked → certified
- Documents: CV, Diplômes, CNI, Attestation d'expérience

### AuthorizedCenter
- 4 centres: Douala, Yaoundé, Bafoussam, Garoua
- Caractéristiques: Salle informatique, Internet stable, Vidéosurveillance

### CertificationStep
- 7 étapes du processus de certification
- Durées estimées pour chaque étape

## 🔐 Services Principaux

### CertificationDataService
- Fourni les niveaux de certification
- Fournit les centres agréés
- Fournit les étapes du processus

### ApplicationService
- Gère les candidatures
- Met à jour les statuts
- Gère les uploads de documents
- Traite les paiements

## 🎯 Fonctionnalités Principales

✅ **Authentification & Autorisation** (À implémenter avec AuthService)
✅ **Formulaires Réactifs** avec validation complète
✅ **Gestion d'État** avec RxJS Observables
✅ **Design Responsive** mobile-first
✅ **Accessibilité** (WCAG 2.1)
✅ **Tailwind CSS** pour le styling
✅ **Modèles TypeScript Stricts**
✅ **Composants Réutilisables**

## 📱 Design Responsive

L'application est entièrement responsive :
- **Mobile** (< 640px): Single column
- **Tablet** (640px - 1024px): 2-3 columns
- **Desktop** (> 1024px): Full grid layouts

## 🔮 Prochaines Étapes

1. **Intégration Backend API**
   - HTTP Interceptors pour l'authentification
   - CSRF Protection
   - Error Handling

2. **Authentification**
   - Service d'authentification
   - Gardes de route (AuthGuard, EligibilityGuard)
   - Refresh token automatique

3. **Simulateur QCM**
   - Composant exam simulator
   - Timer et interface de test
   - Correction automatique

4. **Paiement Intégré**
   - MTN API integration
   - Orange Money API
   - Webhook pour confirmation paiement

5. **Tests Unitaires & E2E**
   - Karma/Jasmine pour les tests
   - Protractor/Cypress pour E2E

6. **Internationalisation (i18n)**
   - Support Français/Anglais

## 📄 Licence & Contact

**Cameroon Project Management Association (CaPMA)**
- Email: contact@capma.cm
- Téléphone: +237 6 00 00 00 00
- Sièges: Douala, Yaoundé, Bafoussam, Garoua

---

**Version**: 1.0.0
**Dernière mise à jour**: 2024
**Framework**: Angular 17.3.0 + Tailwind CSS 3.x
