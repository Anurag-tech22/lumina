import re

with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

# Replace experimental longPolling with standard longPolling
new_content = """import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0502457613",
  appId: "1:416781520917:web:a920d29564eb51d7847e1c",
  apiKey: "AIzaSyAr_NWBJav97EDOhnOyCW7oFCv_GA39wJs",
  authDomain: "gen-lang-client-0502457613.firebaseapp.com",
  storageBucket: "gen-lang-client-0502457613.firebasestorage.app",
  messagingSenderId: "416781520917",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
}, "ai-studio-c75de3e9-d8d7-4376-ad38-40b0d647079c");
"""

with open('src/lib/firebase.ts', 'w') as f:
    f.write(new_content)
