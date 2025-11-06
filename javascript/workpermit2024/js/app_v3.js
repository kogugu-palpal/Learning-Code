// --- Start of app.js ---

// 1. Firebase Configuration and Initialization
const firebaseConfig = {
  apiKey: "AIzaSyBqCrLbfYpfhXaVKvp3drnmRXMS4B3BF94",
  authDomain: "workpermit2014.firebaseapp.com",
  projectId: "workpermit2014",
  storageBucket: "workpermit2014.firebasestorage.app",
  messagingSenderId: "288958833830",
  appId: "1:288958833830:web:68177c9b1fcbbfd33ec067"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
const auth = firebase.auth(app); 

// Set persistence to SESSION: The session will be cleared when the browser tab is closed.
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);

console.log("Firebase is initialized and connected!");

// ==========================================================
// *** 1. INITIALIZE ALL DOM REFERENCES ***
// ==========================================================

// Database reference
const permitsCollectionRef = db.collection('work_permits');

// ==========================================================
// *** GLOBAL URL PARSING AND STATE VARIABLES ***
// ==========================================================
const urlParams = new URLSearchParams(window.location.search);
const isLoginPage = urlParams.get('login') === 'true'; // Used in Section 2
const docId = urlParams.get('docId');                   // Used in Section 4
// ==========================================================


// Main content blocks for toggling
const adminControls = document.getElementById('admin-controls');
const viewerContent = document.getElementById('viewer-content');
const loginPanel = document.getElementById('login-panel');
const loginForm = document.getElementById('login-form'); 
const errorMessage = document.getElementById('login-error-message'); 

// References to the VIEWER content elements (where data will be displayed)
const viewerElements = {
    photo: viewerContent.querySelector('img'),
    applicationNumber: viewerContent.querySelector('.applicationNumber_display'),
    versionNo: viewerContent.querySelector('.versionNo_display'),
    applicationForm: viewerContent.querySelector('.applicationForm_display'),
    foreignerRef: viewerContent.querySelector('.foreignerRef_display'),
    foreignerID: viewerContent.querySelector('.foreignerID_display'),
    permitNo: viewerContent.querySelector('.permitNo_display'),
    issueProvince: viewerContent.querySelector('.issueProvince_display'),
    thaiName: viewerContent.querySelector('.thaiName_display'),
    nameEnglish: viewerContent.querySelector('.nameEnglish_display'),
    age: viewerContent.querySelector('.age_display'),
    nationality: viewerContent.querySelector('.nationality_display'),
    passportNo: viewerContent.querySelector('.passportNo_display'),
    workplace: viewerContent.querySelector('.workplace_display'),
    employerName: viewerContent.querySelector('.employerName_display'),
    officeAddress: viewerContent.querySelector('.officeAddress_display'),
    jobDescription: viewerContent.querySelector('.jobDescription_display'),
    expiryDate: viewerContent.querySelector('.expiryDate_display')
};

// ==========================================================
// *** 2. ADMIN/VIEWER/LOGIN PANEL TOGGLING LOGIC ***
// ==========================================================

auth.onAuthStateChanged(user => {
    const ADMIN_UID = 'VaJwQt0KisSojeDm166dX49vtnt2'; // ⚠️ Ensure this is your actual UID

    // 1. Hide everything by default
    loginPanel.style.display = 'none';
    adminControls.style.display = 'none';
    viewerContent.style.display = 'none';

    if (user && user.uid === ADMIN_UID) {
        // --- STATE A: ADMIN IS LOGGED IN ---
        if (isLoginPage) {
            // Case A1: Admin is on the LOGIN URL (?login=true). Show the form/control panel.
            adminControls.style.display = 'block'; 
        } else {
            // Case A2: Admin is on the PUBLIC URL (index.html). Force immediate logout.
            auth.signOut().then(() => {
                window.location.href = window.location.origin + window.location.pathname; 
            });
            return;
        }

    } else {
        // --- STATE B: NO USER IS LOGGED IN ---
        if (isLoginPage) {
            // Case B1: No user on the LOGIN URL (?login=true). Show the login panel.
            loginPanel.style.display = 'flex';
        } else {
            // Case B2: No user on the PUBLIC URL (index.html). Show viewer content.
            viewerContent.style.display = 'block'; 
        }
    }
});

// ==========================================================
// *** 3. DATA SAVING LOGIC (Admin Form Submission) ***
// ==========================================================

if (adminControls) {
    adminControls.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        // ----------------------------------------------------
        // 1. COLLECT ALL DATA FROM THE FORM FIELDS
        // ----------------------------------------------------
        const applicantData = {
            application_number: document.getElementById('applicationNumber').value,
            version_no: document.getElementById('versionNo').value,
            application_form: document.getElementById('applicationForm').value,
            foreigner_ref: document.getElementById('foreignerRef').value,
            foreigner_id: document.getElementById('foreignerID').value,
            permit_no: document.getElementById('permitNo').value,
            issue_province: document.getElementById('issueProvince').value,
            name_thai: document.getElementById('thaiName').value,
            name_english: document.getElementById('name').value,
            age: document.getElementById('age').value,
            nationality: document.getElementById('nationality').value,
            passport_no: document.getElementById('passportNo').value,
            workplace_address: document.getElementById('workplace').value,
            employer_name: document.getElementById('employerName').value,
            office_address: document.getElementById('officeAddress').value,
            job_description: document.getElementById('jobDescription').value,
            expiry_date: document.getElementById('expiryDate').value,
            photo_url: document.getElementById('photo_url').value,
            last_updated: firebase.firestore.FieldValue.serverTimestamp() 
        };

        try {
            // ----------------------------------------------------
            // 2. SAVE NEW UNIQUE DOCUMENT & GET THE ID
            // ----------------------------------------------------
            const newDocRef = await permitsCollectionRef.add(applicantData);
            const uniqueDocId = newDocRef.id;

            const uniqueURL = `${window.location.origin}${window.location.pathname}?docId=${uniqueDocId}`;
            
            // ----------------------------------------------------
            // 3. SUCCESS MESSAGE & ADMIN WORKFLOW (Replaces form with success box)
            // ----------------------------------------------------
            console.log("SUCCESS! NEW UNIQUE DOCUMENT CREATED WITH ID:", uniqueDocId);
            
            // This displays the unique ID and URL directly in the admin area
            adminControls.innerHTML = `
                <div class="p-4 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
                    <p class="font-bold text-lg">✅ SUCCESS! New Document Saved.</p>
                    <p class="mt-2 text-base">Permanent Document ID: <span class="font-mono text-gray-900">${uniqueDocId}</span></p>
                    <p class="mt-4">Copy the link below to generate your **QR Code**:</p>
                    <textarea rows="4" class="w-full text-sm p-2 border rounded resize-none text-gray-800 font-mono" readonly>${uniqueURL}</textarea>
                    
                    <button onclick="window.location.href = window.location.origin + window.location.pathname + '?login=true'" 
                            class="mt-4 bg-[#215085] hover:bg-[#1a446c] text-white font-bold py-2 px-4 rounded">
                        Create Another Document
                    </button>
                </div>
            `;

        } catch (e) {
            console.error("Error saving document: ", e);
            alert("Error saving data. Check the console for details.");
        }
    });
}

// ==========================================================
// *** 4. DYNAMIC DATA DISPLAY LOGIC (Viewer Content) ***
// ==========================================================

let liveDocRef;

if (docId) {
    // If a docId is found (QR Code scan), reference that specific document
    liveDocRef = permitsCollectionRef.doc(docId);
} else {
    // If no docId, this is either the public homepage or a testing page.
    console.log("No Document ID found in the URL. Viewer data will not load.");
}

// Only set up the listener if we have a valid reference
if (liveDocRef) {
    liveDocRef.onSnapshot(doc => {
        if (doc.exists) {
            const data = doc.data();
            
            // Update viewer elements
            viewerElements.photo.src = data.photo_url || viewerElements.photo.src;
            viewerElements.applicationNumber.textContent = data.application_number || 'N/A';
            viewerElements.versionNo.textContent = data.version_no || 'N/A';
            viewerElements.applicationForm.textContent = data.application_form || 'N/A';
            viewerElements.foreignerRef.textContent = data.foreigner_ref || 'N/A';
            viewerElements.foreignerID.textContent = data.foreigner_id || 'N/A';
            viewerElements.permitNo.textContent = data.permit_no || 'N/A';
            viewerElements.issueProvince.textContent = data.issue_province || 'N/A';
            viewerElements.thaiName.textContent = data.name_thai || 'N/A';
            viewerElements.nameEnglish.textContent = data.name_english || 'N/A';
            viewerElements.age.textContent = data.age || 'N/A';
            viewerElements.nationality.textContent = data.nationality || 'N/A';
            viewerElements.passportNo.textContent = data.passport_no || 'N/A';
            viewerElements.workplace.textContent = data.workplace_address || 'N/A';
            viewerElements.employerName.textContent = data.employer_name || 'N/A';
            viewerElements.officeAddress.textContent = data.office_address || 'N/A';
            viewerElements.jobDescription.textContent = data.job_description || 'N/A';
            
            // Date formatting logic (REPAIRED)
            const dateStr = data.expiry_date;
            let formattedDate = dateStr;
            if (dateStr && dateStr.includes('-')) {
                const parts = dateStr.split('-');
                // Reformat from YYYY-MM-DD to DD/MM/YYYY
                formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`; 
            }
            viewerElements.expiryDate.textContent = formattedDate || 'N/A';

            console.log("Page content updated from unique database document:", docId);
        } else {
            console.log(`Document with ID '${docId}' does not exist.`);
            viewerContent.textContent = "Error: Document verification failed or data not found.";
        }
    }, error => {
        console.error("Error fetching content:", error);
    });
}

// ==========================================================
// *** 5. LOGIN/LOGOUT FORM HANDLER (Login Form Un-Commented) ***
// ==========================================================

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            await auth.signInWithEmailAndPassword(email, password);
            console.log("Login successful! Auth state changed.");

        } catch (error) {
            console.error("Login Error:", error.code, error.message);
            let displayMessage = "Login failed. Check your credentials.";
            
            switch (error.code) {
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                case 'auth/invalid-credential': 
                    displayMessage = "Invalid email or password.";
                    break;
                case 'auth/invalid-email':
                    displayMessage = "The email address is not valid.";
                    break;
            }

            errorMessage.textContent = displayMessage;
            errorMessage.style.display = 'block';
        }
    });
}


// ==========================================================
// *** 6. PERFORMANCE SIGNATURE (Add this section to the end of your JS file) ***
// ==========================================================

// 1. Capture the start time as soon as the script begins executing
const startTime = performance.now();

// 2. Wait until the entire page is loaded (all images, scripts, etc.)
window.onload = function() {
    const endTime = performance.now();
    
    // 2. Calculate total load time in seconds
    const loadTimeSeconds = ((endTime - startTime) / 1000).toFixed(4);
    
    // Get memory details if supported (optional)
    let memoryDetails = '';
    if (window.performance && window.performance.memory) {
        // Convert bytes to MB
        const usedJSHeap = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(3);
        const totalJSHeap = (performance.memory.totalJSHeapSize / (1024 * 1024)).toFixed(3);
        memoryDetails = `used ${usedJSHeap}/${totalJSHeap} MB`;
    }

    // 3. Construct the dynamic part (e.g., "displayed in 0.1605 seconds. used 16.353/16.756 MB")
    // NOTE: Removed the leading "|" as it's not needed if the domain is gone.
    const dynamicMetrics = `displayed in ${loadTimeSeconds} seconds. ${memoryDetails}`;
    
    // 4. Static component (Version text)
    const versionText = '| version |||'; 
    
    // 5. Assemble the FINAL string in the desired order (REMOVED baseDomain)
    // We now just show metrics followed by the version text.
    const finalContent = `${dynamicMetrics} ${versionText}`; 

    // 6. Update the footer element
    const signatureElement = document.getElementById('performance-signature');
    if (signatureElement) {
        signatureElement.textContent = finalContent;
    }
};

// --- End of app.js ---