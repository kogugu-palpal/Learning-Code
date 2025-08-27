import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// IMPORTANT: These global variables are provided by the canvas environment.
// Do not define them yourself.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// The main application component.
const App = () => {
    // State to hold the user's name and the message they want to submit.
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    // State to manage Firebase services and authentication.
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);

    // Effect hook to initialize Firebase and handle authentication.
    useEffect(() => {
        const initFirebase = async () => {
            try {
                // Initialize Firebase app.
                const app = initializeApp(firebaseConfig);
                const firestoreDb = getFirestore(app);
                const firestoreAuth = getAuth(app);

                // Authenticate the user.
                if (initialAuthToken) {
                    await signInWithCustomToken(firestoreAuth, initialAuthToken);
                } else {
                    await signInAnonymously(firestoreAuth);
                }

                // Set state with initialized services and user ID.
                setDb(firestoreDb);
                setAuth(firestoreAuth);
                setUserId(firestoreAuth.currentUser?.uid);
            } catch (error) {
                console.error("Error initializing Firebase:", error);
            }
        };

        // Run the initialization function.
        initFirebase();
    }, []); // Empty dependency array ensures this runs only once on mount.

    // Function to handle form submission.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior.

        if (!db || !userId) {
            console.error("Firebase is not initialized or user is not authenticated.");
            return;
        }

        if (!name || !message) {
            alert('Please fill out both fields.');
            return;
        }

        try {
            // Define the Firestore collection path for public data.
            // The path must follow the security rules: /artifacts/{appId}/public/data/{collection_name}
            const collectionPath = `artifacts/${appId}/public/data/messages`;
            const docRef = await addDoc(collection(db, collectionPath), {
                userId: userId, // Store the user's ID.
                name: name,
                message: message,
                createdAt: serverTimestamp(), // Use a server timestamp for accurate timing.
            });
            console.log("Document written with ID:", docRef.id);

            // Clear the form fields after successful submission.
            setName('');
            setMessage('');

        } catch (error) {
            console.error("Error adding document:", error);
        }
    };

    // Render the form only after Firebase and authentication are ready.
    if (!db || !userId) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Data Collector</h1>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Signed in as User ID: <span className="font-mono text-gray-700">{userId}</span>
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Your Name
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
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows="4"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your message"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Submit Data
                    </button>
                </form>
            </div>
        </div>
    );
};

export default App;
