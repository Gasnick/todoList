// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAsMNnGQPgpQtykLXadrfhRVQt3zk4NM8k",
    authDomain: "tareas-todolist.firebaseapp.com",
    projectId: "tareas-todolist",
    storageBucket: "tareas-todolist.firebasestorage.app",
    messagingSenderId: "907655812218",
    appId: "1:907655812218:web:289b478ff63d003a6697c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);