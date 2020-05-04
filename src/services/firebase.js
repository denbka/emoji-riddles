import firebase from 'firebase'
import "firebase/analytics"
import "firebase/auth"
// import "firebase/firestore"

const config = {
    apiKey: "AIzaSyCgg2PjveIX3VTPQHHPvPvex2cPdopHSRU",
    authDomain: "emojiriddles.firebaseapp.com",
    databaseURL: "https://emojiriddles.firebaseio.com",
    projectId: "emojiriddles",
    storageBucket: "emojiriddles.appspot.com",
    messagingSenderId: "207299150304",
    appId: "1:207299150304:web:0d0c791c444c2914a6ab85",
    measurementId: "G-Q75MFN7CLY"
}

firebase.initializeApp(config)
export const auth = firebase.auth
export const db = firebase.database()
export const firestore = firebase.firestore()