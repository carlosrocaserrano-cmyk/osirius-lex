import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const firebaseAdminConfig = {
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

export function initAdmin() {
    if (!getApps().length) {
        initializeApp(firebaseAdminConfig);
    }
    return { storage: getStorage() };
}
