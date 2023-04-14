import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

let firebaseConfig = require('.././api-keys.json')["firebase"];

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the Realtime Database and export a reference to it
export const database = getDatabase(app);