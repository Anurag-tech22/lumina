<br/>
<div align="center">
<a href="https://github.com/Anurag-tech22/lumina">
<img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" alt="Logo" width="80" height="80">
</a>
<h3 align="center">Lumina</h3>
<p align="center">
A Professional AI Workspace & Cognitive Synthesizer
<br/>
<br/>
<a href="https://github.com/Anurag-tech22/lumina"><strong>Explore the docs »</strong></a>
<br/>
<br/>
<a href="https://github.com/Anurag-tech22/lumina">View Demo</a>
·
<a href="https://github.com/Anurag-tech22/lumina/issues">Report Bug</a>
·
<a href="https://github.com/Anurag-tech22/lumina/issues">Request Feature</a>
</p>
</div>

---

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#key-features">Key Features</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#architecture">Architecture</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#security">Security</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## 🌌 About The Project

Lumina is a premium, full-stack AI research and chat workspace designed for deep cognitive synthesis. It provides a sophisticated, responsive interface built with React and Tailwind CSS, backed by a secure Node.js/Express server that integrates the latest Google Gemini models. 

Unlike basic chat interfaces, Lumina offers **Omni-Cognitive Synthesis** and deep research capabilities, serving as a dedicated, fully-isolated personal vault for your thoughts and ideas.

## ✨ Key Features

* 🧠 **Omni-Cognitive Synthesis:** Seamless integration with Gemini 3.5 Flash for advanced chat and deep research.
* 🔒 **Secure Data Persistence:** Real-time synchronization of chat sessions using Firebase Firestore.
* 🛡️ **Zero-Trust Backend:** Server-side proxying of all AI requests with strict JWT bearer token validation. Your API keys are never exposed to the client.
* 🎨 **Top-Tier Aesthetics:** A beautifully crafted, distraction-free dark mode UI featuring fluid typography and `framer-motion` micro-animations.

## 💻 Built With

Lumina is built using modern web technologies to ensure a scalable, fast, and delightful user experience.

* [![React][React.js]][React-url]
* [![Vite][Vite.js]][Vite-url]
* [![Tailwind][Tailwind.css]][Tailwind-url]
* [![Express][Express.js]][Express-url]
* [![Firebase][Firebase.js]][Firebase-url]

## 📐 Architecture

Lumina utilizes a robust client-server architecture with server-side AI processing to maximize security.

### Component Flow

```mermaid
graph TD
    subgraph Client [Client-Side Application]
        UI[React + Tailwind UI]
        AuthClient[Firebase Auth SDK]
        State[Local State / Context]
    end

    subgraph Backend [Cloud Run Backend / Express]
        API[API Router /api/*]
        Middle[Auth Middleware]
        GenAI[Google Gen AI SDK]
    end
    
    subgraph GoogleCloud [Google Cloud & Firebase]
        Firestore[(Firestore DB)]
        Identity[Firebase Auth]
        Gemini[Gemini API]
        Secrets[Secret Manager]
    end

    UI -->|JWT Bearer Token| API
    UI -->|Direct Read/Write| Firestore
    UI <-->|Login/Tokens| AuthClient
    AuthClient <--> Identity
    
    API --> Middle
    Middle -.->|Verifies Token| Identity
    Middle --> GenAI
    GenAI -->|Uses GEMINI_API_KEY| Gemini
    Secrets -->|Injects| GenAI
    
    style Client fill:#1e293b,stroke:#3b82f6,color:#fff
    style Backend fill:#1e293b,stroke:#10b981,color:#fff
    style GoogleCloud fill:#1e293b,stroke:#f59e0b,color:#fff
```

### AI Message Processing

```mermaid
sequenceDiagram
    participant U as User
    participant C as Lumina Client (React)
    participant S as Express Server
    participant F as Firestore
    participant G as Gemini API
    
    U->>C: Types message and sends
    C->>F: Save user message to Firestore
    C->>S: POST /api/chat (with JWT Token)
    S->>S: Verify JWT Token (Auth Middleware)
    S->>G: Request AI Completion (with API Key)
    G-->>S: Return Generated Response
    S-->>C: Return Response payload
    C->>F: Save AI message to Firestore
    C-->>U: Update UI with AI Response
```

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or higher)
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Anurag-tech22/lumina.git
   ```
2. Install NPM packages
   ```sh
   cd lumina
   npm install
   ```
3. Create a `.env` file in the root directory and add your keys:
   ```env
   VITE_FIREBASE_API_KEY="your_api_key"
   VITE_FIREBASE_AUTH_DOMAIN="your_domain"
   VITE_FIREBASE_PROJECT_ID="your_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
   VITE_FIREBASE_APP_ID="your_app_id"
   GEMINI_API_KEY="your_gemini_api_key_for_local_dev"
   ```
4. Start the development server
   ```sh
   npm run dev
   ```

## ☁️ Deployment

Lumina is designed to be easily deployed to Google Cloud Run. 

1. **Secret Management Setup:** Never hardcode your API keys.
   ```sh
   gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
   echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-
   
   # Grant access
   gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
     --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor"
   ```

2. **Deploy to Cloud Run:**
   ```sh
   gcloud run deploy lumina-workspace \
     --source . \
     --region=us-central1 \
     --allow-unauthenticated \
     --update-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest
   ```

## 🛡️ Security

Lumina implements strict **User Data Isolation**. Users can only read and write their own data. Navigate to the Firebase Console and deploy the following `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /sessions/{sessionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vite.js]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Tailwind.css]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[Firebase.js]: https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black
[Firebase-url]: https://firebase.google.com/
