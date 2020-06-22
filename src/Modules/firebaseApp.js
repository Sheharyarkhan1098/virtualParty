import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import "firebase/storage";
import "firebase/functions";
import "firebase/performance";

import { functions } from "firebase/app";

var firebaseApp = firebase;

export const firebaseConfig = {
  apiKey: "AIzaSyChK-VeLyK0TIEH--W1mjfLUGP50DewdZE",
  authDomain: "partyapp-53b91.firebaseapp.com",
  databaseURL: "https://partyapp-53b91.firebaseio.com",
  projectId: "partyapp-53b91",
  storageBucket: "partyapp-53b91.appspot.com",
  messagingSenderId: "548512127648",
  appId: "1:548512127648:web:cc3847ad56a531c6c2c7c5",
  measurementId: "G-VEVCL74WVY"
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID
};
// Initialize Firebase
if (firebase.apps.length === 0) {
  firebaseApp.initializeApp(firebaseConfig);
}
export default firebaseApp;

const perf = firebase.performance();

const functionsApp = functions();
const loginInEvent = functionsApp.httpsCallable("loginInEvent");

// if (process.env.NODE_ENV === "development") {
//   functionsApp.useFunctionsEmulator("http://localhost:5001")
// }

const getTimestampFromDate = (date) => {
  return firebaseApp.firestore.Timestamp.fromDate(date);
};

export { loginInEvent, getTimestampFromDate, perf };
