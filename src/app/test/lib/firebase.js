import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvyQlgHa0K9De_ya5ze1s1PnKHUNBV3YU",
  authDomain: "shahza-f6ebb.firebaseapp.com",
  projectId: "shahza-f6ebb",
  storageBucket: "shahza-f6ebb.firebasestorage.app",
  messagingSenderId: "1062016950860",
  appId: "1:1062016950860:web:7e563bf9db48dbc7b00ae9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
