import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOvO_qZRNiHhSQIA4eCrnBKnFVAWxtyeA",
  authDomain: "hackwarz2k26.firebaseapp.com",
  projectId: "hackwarz2k26",
  storageBucket: "hackwarz2k26.firebasestorage.app",
  messagingSenderId: "557439065907",
  appId: "1:557439065907:web:29ef5c9867ef2f73abe846"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);