// firebase.ts (en la raíz del repo)
import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBNUSDkPwns9cYKefMnisZj7z01eKyk2mg',
  authDomain: 'sample-firebase-ai-app-153e9.firebaseapp.com',
  projectId: 'sample-firebase-ai-app-153e9',
  storageBucket: 'sample-firebase-ai-app-153e9.appspot.com',
  messagingSenderId: '616071508078',
  appId: '1:616071508078:web:08257e0b42d15e0dcb367f',
};

const app = initializeApp(firebaseConfig);

// En previews/proxies puñeteros, esto evita bloqueos de transporte
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// Smoke test para comprobar conectividad real
export async function smokeTest() {
  try {
    await getDocs(collection(db, 'smoke_test'));
    console.log('Firestore reachable ✅ | host:', window.location.hostname);
  } catch (e) {
    console.error('Firestore unreachable ❌', e);
  }
}
