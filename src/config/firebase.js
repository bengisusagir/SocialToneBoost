
import { initializeApp } from "firebase/app";
import {getAuth ,GoogleAuthProvider,updateProfile} from  "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCi9VC4DMNUfq9udOYO1YTLx7_3wQbx9jQ",
  authDomain: "socialtone-ua14.firebaseapp.com",
  projectId: "socialtone-ua14",
  storageBucket: "socialtone-ua14.appspot.com",
  messagingSenderId: "760340625535",
  appId: "1:760340625535:web:7205bc2b649b4f611f274a",
  measurementId: "G-4T38PLXEMT"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const upPro = updateProfile(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

