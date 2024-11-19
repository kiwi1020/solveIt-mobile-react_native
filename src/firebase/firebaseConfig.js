import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database'; // Realtime Database
import { initializeFirestore } from 'firebase/firestore';
import { 
  FIREBASE_API_KEY, 
  FIREBASE_AUTH_DOMAIN, 
  FIREBASE_PROJECT_ID, 
  FIREBASE_STORAGE_BUCKET, 
  FIREBASE_MESSAGING_SENDER_ID, 
  FIREBASE_APP_ID 
} from '@env';

// Firebase 설정
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};


// Firebase 앱 초기화
const firebaseApp = initializeApp(firebaseConfig);

// Realtime Database 초기화
const database = getDatabase(firebaseApp);

export default firebaseApp;
