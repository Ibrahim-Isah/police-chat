import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyB6fvbbKPsLSyZrUYTB1EXWqLrc3RKt7cY',
	authDomain: 'chat-app-85c3d.firebaseapp.com',
	projectId: 'chat-app-85c3d',
	storageBucket: 'chat-app-85c3d.appspot.com',
	messagingSenderId: '591103313822',
	appId: '1:591103313822:web:e49146b0dca9b639b8788f',
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
