import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  indexedDBLocalPersistence, 
  browserLocalPersistence, 
  setPersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging"; // Untuk Web Push Notifications
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHq8UCcbYTGXCHySX75F5-45b_faSywGA",
  authDomain: "coneksiaplikasi.firebaseapp.com",
  databaseURL: "https://coneksiaplikasi-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "coneksiaplikasi",
  storageBucket: "coneksiaplikasi.firebasestorage.app",
  messagingSenderId: "226840353263",
  appId: "1:226840353263:web:36a0982a55cb1e12e3fe1a"
};

// Cek apakah Firebase sudah diinisialisasi sebelumnya
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Deteksi apakah aplikasi berjalan di React Native atau Web
const isReactNative = typeof navigator !== "undefined" && navigator.product === "ReactNative";

// Inisialisasi Firebase Auth tanpa error
let auth;
if (isReactNative) {
  // Firebase Auth di React Native tidak mendukung browserLocalPersistence
  try {
    auth = initializeAuth(app, { persistence: indexedDBLocalPersistence });
  } catch (error) {
    auth = getAuth(app); // Jika sudah diinisialisasi, ambil instance yang ada
  }
} else {
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence).catch(console.error); // Simpan sesi login di Web
}

// Inisialisasi Firestore & Realtime Database
const db = getFirestore(app);
const realtimeDb = getDatabase(app);

// Inisialisasi Firebase Cloud Messaging (Hanya untuk Web)
let messaging = null;
if (typeof window !== "undefined" && "Notification" in window) {
  messaging = getMessaging(app);
}

export { app, auth, db, realtimeDb, messaging, getToken, onMessage };
