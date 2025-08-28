import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
    // State to hold the user's data.
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // State to manage Firebase services and authentication.
    const [db, setDb] = useState(null);
    const [storage, setStorage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');

    // Effect hook to initialize Firebase and handle authentication.
    useEffect(() => {
        const initFirebase = async () => {
            try {
                const app = initializeApp(firebaseConfig);
                const firestoreDb = getFirestore(app);
                const firebaseStorage = getStorage(app);
                const firestoreAuth = getAuth(app);

                // Authenticate the user anonymously.
                await signInAnonymously(firestoreAuth);

                setDb(firestoreDb);
                setStorage(firebaseStorage);
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

    // Function to handle image file selection.
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Function to upload the image to Firebase Storage.
    const uploadImage = async (file) => {
        if (!storage || !userId) {
            setStatusMessage('Storage service is not available.');
            return null;
        }

        setStatusMessage('Uploading photo...');
        const imageRef = ref(storage, `photos/${userId}/${file.name}-${Date.now()}`);
        await uploadBytes(imageRef, file);
        return await getDownloadURL(imageRef);
    };

    // Function to handle form submission.
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setStatusMessage('');

        if (!db || !userId) {
            setStatusMessage('Error: Firebase is not initialized or user is not authenticated.');
            return;
        }

        if (!name || !dob || !fatherName || !imageFile) {
            setStatusMessage('Please fill out all fields and upload a photo.');
            return;
        }

        if (!validateDob(dob)) {
            setStatusMessage('Please enter Date of Birth in DD/MM/YYYY format.');
            return;
        }

        try {
            // Upload the image first and get its URL.
            const photoUrl = await uploadImage(imageFile);
            if (!photoUrl) {
                setStatusMessage('Photo upload failed. Please try again.');
                return;
            }

            // Define the Firestore collection path.
            const collectionPath = `user-data`;
            const docRef = await addDoc(collection(db, collectionPath), {
                userId: userId, 
                name: name,
                dateOfBirth: dob,
                fatherName: fatherName,
                photoUrl: photoUrl,
                createdAt: serverTimestamp(),
            });
            console.log("Document written with ID:", docRef.id);
            setStatusMessage('Data submitted successfully!');

            // Clear the form fields and image states after successful submission.
            setName('');
            setDob('');
            setFatherName('');
            setImageFile(null);
            setPreviewUrl('');

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Data Collection</h1>
                    <p className="text-sm text-gray-500">Please fill out the form below to submit your details.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                        <label htmlFor="imageInput" className="cursor-pointer">
                            <div className="relative w-28 h-28 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 rounded-lg flex items-center justify-center mb-4 overflow-hidden border-2 border-dashed border-blue-200 hover:border-blue-400">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center text-blue-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 3-3 4 8z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs mt-1">Add Photo</span>
                                    </div>
                                )}
                            </div>
                        </label>
                        <input
                            type="file"
                            id="imageInput"
                            accept="image/*"
                            capture="camera"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div>
                        <label htmlFor="dob" className="block text-sm font-semibold text-gray-700">
                            Date of Birth
                        </label>
                        <input
                            type="text"
                            id="dob"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="DD/MM/YYYY"
                        />
                    </div>
                    <div>
                        <label htmlFor="fatherName" className="block text-sm font-semibold text-gray-700">
                            Father Name
                        </label>
                        <input
                            type="text"
                            id="fatherName"
                            value={fatherName}
                            onChange={(e) => setFatherName(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                            className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={handleExit}
                            className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
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
