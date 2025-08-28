import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Your web app's Firebase configuration
// This configuration is automatically provided by the Canvas environment.
const firebaseConfig = {
    apiKey: "AIzaSyAAHVZbTMRfV-VXUI1S9exJRfLjzXXneUw",
    authDomain: "data-collection-ad39e.firebaseapp.com",
    projectId: "data-collection-ad39e",
    storageBucket: "data-collection-ad39e.firebasestorage.app",
    messagingSenderId: "187511830981",
    appId: "1:187511830981:web:7f03d1a3f45a9039ecb3ac",
    measurementId: "G-9YQ09BB8F5"
};

// The main application component.
const App = () => {
    // State to hold the user's name, date of birth, and father's name.
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [fatherName, setFatherName] = useState('');
    // State to manage Firebase services and authentication.
    const [db, setDb] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');

    // Effect hook to initialize Firebase and handle authentication.
    useEffect(() => {
        const initFirebase = async () => {
            try {
                const app = initializeApp(firebaseConfig);
                const firestoreDb = getFirestore(app);
                const firestoreAuth = getAuth(app);

                // Authenticate the user anonymously.
                await signInAnonymously(firestoreAuth);

                setDb(firestoreDb);
                setUserId(firestoreAuth.currentUser?.uid);
                setLoading(false); 
            } catch (error) {
                console.error("Error initializing Firebase:", error);
                setLoading(false);
                setStatusMessage('Error initializing Firebase. Please check your console.');
            }
        };

        initFirebase();
    }, []);

    // Function to validate the date of birth format.
    const validateDob = (dateString) => {
        // Regex for DD/MM/YYYY format.
        const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
        return regex.test(dateString);
    };

    // Function to handle form submission.
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setStatusMessage('');

        if (!db || !userId) {
            setStatusMessage('Error: Firebase is not initialized or user is not authenticated.');
            return;
        }

        if (!name || !dob || !fatherName) {
            setStatusMessage('Please fill out all fields.');
            return;
        }

        if (!validateDob(dob)) {
            setStatusMessage('Please enter Date of Birth in DD/MM/YYYY format.');
            return;
        }

        try {
            // Define the Firestore collection path.
            const collectionPath = `user-data`;
            const docRef = await addDoc(collection(db, collectionPath), {
                userId: userId, 
                name: name,
                dateOfBirth: dob,
                fatherName: fatherName,
                createdAt: serverTimestamp(),
            });
            console.log("Document written with ID:", docRef.id);
            setStatusMessage('Data submitted successfully!');

            // Clear the form fields after successful submission.
            setName('');
            setDob('');
            setFatherName('');

        } catch (error) {
            console.error("Error adding document:", error);
            setStatusMessage('Error submitting data. Please try again.');
        }
    };

    // Function to handle the "Exit" button click.
    const handleExit = () => {
        setStatusMessage('Exiting the form.');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="text-gray-700 text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center mb-4">
                        <span className="text-gray-500">Photo</span>
                    </div>
                    <p className="text-sm text-gray-500 text-center break-words">
                        Signed in as User ID: <span className="font-mono text-gray-700">{userId}</span>
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div>
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                            Date of Birth
                        </label>
                        <input
                            type="text"
                            id="dob"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="DD/MM/YYYY"
                        />
                    </div>
                    <div>
                        <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700">
                            Father Name
                        </label>
                        <input
                            type="text"
                            id="fatherName"
                            value={fatherName}
                            onChange={(e) => setFatherName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your father's name"
                        />
                    </div>
                    
                    {statusMessage && (
                        <div className="mt-4 text-center text-sm font-medium">
                            <p className={statusMessage.includes('Error') || statusMessage.includes('Please') ? 'text-red-600' : 'text-green-600'}>
                                {statusMessage}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-between space-x-4 mt-6">
                        <button
                            type="submit"
                            className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={handleExit}
                            className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            Exit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

export default App;
