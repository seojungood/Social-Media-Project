import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore';

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6lUruymRFx_5nPvTlm_yhHOriIDP_OXs",
  authDomain: "seojungood-project1.firebaseapp.com",
  projectId: "seojungood-project1",
  storageBucket: "seojungood-project1.appspot.com",
  messagingSenderId: "791956520207",
  appId: "1:791956520207:web:8a2d2e1a9b1f723f5c527a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Exporting authentication/provider/database
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);