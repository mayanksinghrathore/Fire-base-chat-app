// Import stylesheets
import "./style.css";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from "firebaseui";

// Document elements
const startRsvpButton = document.getElementById("startRsvp");
const guestbookContainer = document.getElementById("guestbook-container");

const form = document.getElementById("leave-message");
const input = document.getElementById("message");
const guestbook = document.getElementById("guestbook");
const numberAttending = document.getElementById("number-attending");
const rsvpYes = document.getElementById("rsvp-yes");
const rsvpNo = document.getElementById("rsvp-no");

var rsvpListener = null;
var guestbookListener = null;

async function main() {
  // Add Firebase project configuration object here
   var firebaseConfig = {
    apiKey: "AIzaSyBb2JzPG_4Fc1t1EEwuNpPgKNGnhEbSmtA",
    authDomain: "fir-code-lab-6c10d.firebaseapp.com",
    projectId: "fir-code-lab-6c10d",
    storageBucket: "fir-code-lab-6c10d.appspot.com",
    messagingSenderId: "650085428222",
    appId: "1:650085428222:web:a48b2e084f51f8cf5d6eaf"
  };

firebase.initializeApp(firebaseConfig);

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      }
    }
  };

 const ui = new firebaseui.auth.AuthUI(firebase.auth());
startRsvpButton.addEventListener("click",
 () => {
    if (firebase.auth().currentUser) {
      // User is signed in; allows user to sign out
      firebase.auth().signOut();
    } else {
      // No user is signed in; allows user to sign in
      ui.start("#firebaseui-auth-container", uiConfig);
    }
});

// Listen to the current Auth state
firebase.auth().onAuthStateChanged((user) => {
 if (user){
   startRsvpButton.textContent = "LOGOUT";
   // Show guestbook to logged-in users
   guestbookContainer.style.display = "block";
   subscribeGuestbook();
 }
 else{
   startRsvpButton.textContent = "RSVP";
   // Hide guestbook for non-logged-in users
   guestbookContainer.style.display = "none";
   unsubscribeGuestbook();
 }
});
form.addEventListener("submit", (e) => {
 // Prevent the default form redirect
 e.preventDefault();
 // Write a new message to the database collection "guestbook"
 firebase.firestore().collection("guestbook").add({
   text: input.value,
   timestamp: Date.now(),
   name: firebase.auth().currentUser.displayName,
   userId: firebase.auth().currentUser.uid
 })
 // clear message input field
 input.value = ""; 
 // Return false to avoid redirect
 return false;
});
// ...
// Create query for messages
function subscribeGuestbook(){
   // Create query for messages
 guestbookListener = firebase.firestore().collection("guestbook")
 .orderBy("timestamp","desc")
 .onSnapshot((snaps) => {
   // Reset page
   guestbook.innerHTML = "";
   // Loop through documents in database
   snaps.forEach((doc) => {
     // Create an HTML entry for each document and add it to the chat
     const entry = document.createElement("p");
     entry.textContent = doc.data().name + ": " + doc.data().text;
     guestbook.appendChild(entry);
   });
 });
};
function unsubscribeGuestbook(){
 if (guestbookListener != null)
 {
   guestbookListener();
   guestbookListener = null;
 }
};
}
main();

