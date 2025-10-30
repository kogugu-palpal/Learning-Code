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
// CRITICAL FIX 1: Initialize the auth object for use below
const auth = firebase.auth(app); 

console.log("Firebase is initialized and connected!");

// ==========================================================
// *** NEW ADMIN/VIEWER TOGGLING LOGIC STARTS HERE ***
// ==========================================================

// 1. Get references to the two main content blocks
const adminControls = document.getElementById('admin-controls');
const viewerContent = document.getElementById('viewer-content');


// The variable will be defined inside the hook.

auth.onAuthStateChanged(user => {
    // 1. Determine Role (Default to Viewer)
    let isAdmin = false; 

    // -------------------------------------------------------------------
    // 🔥 CRITICAL FIX: Add the URL check here to override the viewer state
    // -------------------------------------------------------------------
    if (document.location.search.includes('admin=true')) {
        isAdmin = true;
        console.log("TEST MODE: Admin privileges granted via URL parameter.");
    }
    // -------------------------------------------------------------------

    if (user) {
        // User is signed in. Check for Admin status.
        const ADMIN_UID = 'YOUR_ADMIN_FIREBASE_UID_HERE'; // ⚠️ Your actual UID here
        
        if (user.uid === ADMIN_UID) {
            isAdmin = true;
            console.log("Admin privileges granted!");
        } else {
            console.log("User is signed in but is NOT an admin (Viewer mode).");
        }
    } else {
        // User is signed OUT (Default Viewer mode).
        console.log('User is signed out (Viewer mode).');
    }
    
    // 2. Toggle the visibility based on the final determined role
    if (isAdmin) {
        // ADMIN VIEW: Show the form
        if (viewerContent) {
            viewerContent.style.display = 'none';
        }
        if (adminControls) {
            adminControls.style.display = 'block'; 
        }
    } else {
        // VIEWER VIEW: Show the static content
        if (adminControls) {
            adminControls.style.display = 'none'; 
        }
        if (viewerContent) {
            viewerContent.style.display = 'block'; 
        }
    }
});

// ==========================================================
// *** DATA SAVING LOGIC STARTS HERE ***
// ==========================================================

// Get references to the form
const adminForm = document.getElementById('admin-controls');

if (adminForm) {
    // Listen for the 'submit' event on the entire form
    adminForm.addEventListener('submit', async (event) => {
        
        event.preventDefault(); 

        // ----------------------------------------------------
        // 1. COLLECT ALL DATA FROM THE FORM FIELDS
        // ----------------------------------------------------
        const applicationNumberValue = document.getElementById('applicationNumber').value;
        const versionNoValue = document.getElementById('versionNo').value;
        const applicationFormValue = document.getElementById('applicationForm').value;
        const foreignerRefValue = document.getElementById('foreignerRef').value;
        const foreignerIDValue = document.getElementById('foreignerID').value;
        const permitNoValue = document.getElementById('permitNo').value;
        const issueProvinceValue = document.getElementById('issueProvince').value;
        const thaiNameValue = document.getElementById('thaiName').value;
        const nameValue = document.getElementById('name').value;
        const ageValue = document.getElementById('age').value;
        const nationalityValue = document.getElementById('nationality').value;
        const passportNoValue = document.getElementById('passportNo').value;
        const workplaceValue = document.getElementById('workplace').value;
        const employerNameValue = document.getElementById('employerName').value;
        const officeAddressValue = document.getElementById('officeAddress').value;
        const jobDescriptionValue = document.getElementById('jobDescription').value;
        const expiryDateValue = document.getElementById('expiryDate').value;
        const photoUrlValue = document.getElementById('photo_url').value;

        // Prepare the data object
        const applicantData = {
            application_number: applicationNumberValue,
            version_no: versionNoValue,
            application_form: applicationFormValue,
            foreigner_ref: foreignerRefValue,
            foreigner_id: foreignerIDValue,
            permit_no: permitNoValue,
            issue_province: issueProvinceValue,
            name_thai: thaiNameValue,
            name_english: nameValue,
            age: ageValue,
            nationality: nationalityValue,
            passport_no: passportNoValue,
            workplace_address: workplaceValue,
            employer_name: employerNameValue,
            office_address: officeAddressValue,
            job_description: jobDescriptionValue,
            expiry_date: expiryDateValue,
            photo_url: photoUrlValue,
            // CRITICAL FIX 2: Removed extra ()
            last_updated: firebase.firestore.FieldValue.serverTimestamp() 
        };

        try {
            // ----------------------------------------------------
            // 2. SAVE/UPDATE DATA TO FIRESTORE
            // ----------------------------------------------------
            const docId = applicantData.application_number; 
            const docRef = db.collection("work_permits").doc(docId);
            
            await docRef.set(applicantData, { merge: true });

            alert(`Work Permit data (${docId}) saved successfully!`);
            
            // NOTE: You will need a function here to load the newly saved data 
            // and update the fields in the #viewer-content div.

        } catch (e) {
            console.error("Error saving document: ", e);
            alert("Error saving data. Check the console for details.");
        }
    });
}
// --- End of app.js ---