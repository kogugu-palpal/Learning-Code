// The HTML script tags (index.html) must remain the same:
/*
<script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore-compat.js"></script>
<script src="./js/app.js"></script>
*/

// --- Start of app.js ---

// 1. Firebase Configuration and Initialization
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:a1b2c3d4e5f6g7h8"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

console.log("Firebase is initialized and connected!");

// 2. Form Interaction
const saveButton = document.getElementById('save-data-button'); // Corrected ID

// MUST use 'async' here to use 'await' inside.
saveButton.addEventListener('click', async (event) => {
    // 1. MUST pass the event object to the function to prevent default.
    event.preventDefault(); 

    // 2. Collect data from the form (make sure these IDs match your HTML)
    const photoUrlValue = document.getElementById('photo_url').value;
    const applicationNumberValue = document.getElementById('applicationNumber').value;
    const nameValue = document.getElementById('name').value;

    try {
        // 3. Reference the specific document we want to update (Compatibility Style)
        const docRef = db.collection("applicants").doc("current_applicant");
        
        // 4. Save the data to the document (Compatibility Style)
        // Note: The variable used is photoUrlValue, which we defined above.
        await docRef.set({
            name: nameValue,
            photo_url: photoUrlValue, // Corrected variable name
            application_number: applicationNumberValue
        });

        alert("Data saved successfully!");

        // Optional: Clear the form after submission
        document.getElementById('photo_url').value = '';
        document.getElementById('applicationNumber').value = '';
        document.getElementById('name').value = '';

    } catch (e) {
        console.error("Error saving document: ", e);
        alert("Error saving data. Check the console for details.");
    }
});