import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBFFR1LgR9JLW5mSsRYdeOD-_jubU2CCVM",
    authDomain: "auth-e11a6.firebaseapp.com",
    projectId: "auth-e11a6",
    storageBucket: "auth-e11a6.firebasestorage.app",
    messagingSenderId: "644439446228",
    appId: "1:644439446228:web:4801be3eb50c97c3e22141",
    measurementId: "G-XBEJT86W96"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Google Login Hatası:", error);
        throw error;
    }
};