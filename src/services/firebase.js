import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA3NX7hcR5IKPt83bCiV4UQcDdFo4_Xduk",
  authDomain: "eggsort-ai.firebaseapp.com",
  databaseURL: "https://eggsort-ai-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "eggsort-ai",
  storageBucket: "eggsort-ai.firebasestorage.app",
  messagingSenderId: "997205571269",
  appId: "1:997205571269:web:05bafdb048fbafd32d62ac",
  measurementId: "G-PJBXP5V88E"
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Inisialisasi Realtime Database
export const rtdb = getDatabase(app);

// Helper function untuk mendengarkan perubahan data real-time
export function subscribeToPath(path, callback) {
  const dbRef = ref(rtdb, path);
  return onValue(dbRef, (snapshot) => {
    callback(snapshot.val());
  });
}

// Helper function untuk mengirim perintah / data ke ESP32 / Konveyor
export function writeToPath(path, data) {
  const dbRef = ref(rtdb, path);
  return set(dbRef, data);
}

export default app;

