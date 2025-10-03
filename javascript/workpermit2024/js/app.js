src="https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"
src="https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore-compat.js"



// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:a1b2c3d4e5f6g7h8"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Get a reference to the Firestore service
const db = firebase.firestore(app);

// Test the connection
console.log("Firebase is initialized anconnected!");

// Add save button
const saveButton = document.getElementById('save-data');

// Add event listener to the button
saveButton.addEventListener('click', () => {
    // Collect data from the form
    event.preventDefault(); // Prevent form submission
    const photo_url = document.getElementById('photo_url').value;
    const applicationNumber = document.getElementById('application-number').value;
    const nameValue = document.getElementById('name').value;
});