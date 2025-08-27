import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where, addDoc, getDocs } from 'firebase/firestore';

// Main App component
export default function App() {
    // State for Firebase services
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // State for form data
    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        dob: '',
        photo: null
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // State to manage the UI view
    const [currentView, setCurrentView] = useState('form'); // 'form' | 'success' | 'download'

    // Initialize Firebase and handle authentication
    useEffect(() => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        if (Object.keys(firebaseConfig).length > 0) {
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const firebaseAuth = getAuth(app);
            setDb(firestore);
            setAuth(firebaseAuth);

            const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    // Sign in anonymously if no user is authenticated
                    try {
                        if (initialAuthToken) {
                            await signInWithCustomToken(firebaseAuth, initialAuthToken);
                        } else {
                            await signInAnonymously(firebaseAuth);
                        }
                    } catch (error) {
                        console.error("Firebase auth error:", error);
                    }
                }
                setIsAuthReady(true);
            });

            // Cleanup subscription on unmount
            return () => unsubscribe();
        }
    }, []);

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Function to handle photo upload and conversion to Base64
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    // Function to clear the form
    const clearForm = () => {
        setFormData({ name: '', fatherName: '', dob: '', photo: null });
        setStatusMessage('');
        setCurrentView('form');
    };

    // Function to submit the form data to Firestore
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthReady || !db) {
            setStatusMessage("App is not ready. Please wait a moment.");
            return;
        }

        if (!formData.name || !formData.fatherName || !formData.dob || !formData.photo) {
            setStatusMessage("Please fill out all fields.");
            return;
        }

        setIsLoading(true);
        setStatusMessage('');

        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const collectionPath = `artifacts/${appId}/public/data/formData`;
        
        try {
            const docRef = await addDoc(collection(db, collectionPath), {
                ...formData,
                timestamp: new Date().toISOString()
            });
            setStatusMessage("Data saved successfully!");
            setCurrentView('success');
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
            setStatusMessage("Error saving data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Function to download all data as a CSV
    const handleDownload = async () => {
        if (!isAuthReady || !db) {
            setStatusMessage("App is not ready. Please wait a moment.");
            return;
        }

        setIsLoading(true);
        setStatusMessage("Generating CSV...");

        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const collectionPath = `artifacts/${appId}/public/data/formData`;

        try {
            const querySnapshot = await getDocs(collection(db, collectionPath));
            
            let csvContent = "data:text/csv;charset=utf-8,";
            
            // Define CSV header
            const headers = ['Name', 'FatherName', 'DateOfBirth', 'Photo (Base64)', 'Timestamp'];
            csvContent += headers.join(',') + '\r\n';

            // Add data rows
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const row = [
                    `"${data.name}"`,
                    `"${data.fatherName}"`,
                    data.dob,
                    `"${data.photo}"`, // Photo is stored as a long base64 string
                    data.timestamp
                ];
                csvContent += row.join(',') + '\r\n';
            });
            
            // Create a temporary link and trigger download
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "form_data.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setStatusMessage("CSV downloaded successfully!");
            setCurrentView('download');
        } catch (error) {
            console.error("Error fetching documents or creating CSV: ", error);
            setStatusMessage("Error downloading data.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderView = () => {
        switch (currentView) {
            case 'form':
                return (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                placeholder="e.g., John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                            <input
                                type="text"
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                placeholder="e.g., Peter Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Photo</label>
                            <input
                                type="file"
                                accept="image/*"
                                name="photo"
                                onChange={handlePhotoUpload}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            />
                            {formData.photo && (
                                <img
                                    src={formData.photo}
                                    alt="Selected"
                                    className="mt-4 rounded-md shadow-md max-h-48 w-auto"
                                />
                            )}
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Submit Data'}
                            </button>
                        </div>
                    </form>
                );
            case 'success':
                return (
                    <div className="text-center p-6 bg-green-50 rounded-lg shadow-inner">
                        <svg className="mx-auto h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-4 text-xl font-medium text-gray-900">Data Saved!</h3>
                        <p className="mt-2 text-md text-gray-500">Your information has been successfully recorded.</p>
                        <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={clearForm}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Submit Another Entry
                            </button>
                            <button
                                onClick={handleDownload}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Downloading...' : 'Download All Data (CSV)'}
                            </button>
                        </div>
                    </div>
                );
            case 'download':
                return (
                    <div className="text-center p-6 bg-blue-50 rounded-lg shadow-inner">
                        <svg className="mx-auto h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <h3 className="mt-4 text-xl font-medium text-gray-900">Download Complete!</h3>
                        <p className="mt-2 text-md text-gray-500">The CSV file has been downloaded. You can open it in Excel.</p>
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={clearForm}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Start a New Entry
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 font-sans antialiased">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Family Data Form</h1>
                {statusMessage && (
                    <div className={`p-4 mb-4 text-sm rounded-lg ${statusMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {statusMessage}
                    </div>
                )}
                {renderView()}
            </div>
        </div>
    );
}
