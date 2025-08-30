import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAHVZbTMRfV-VXUI1S9exJRfLjzXXneUw",
    authDomain: "data-collection-ad39e.firebaseapp.com",
    projectId: "data-collection-ad39e",
    storageBucket: "data-collection-ad39e.firebasestorage.app",
    messagingSenderId: "187511830981",
    appId: "1:187511830981:web:7f03d1a3f45a9039ecb3ac",
    measurementId: "G-9YQ09BB8F5"
};

// Translation content for different languages
const translations = {
    'English': {
        headerTitle: 'Data Collection',
        headerDescription: 'Please fill out the form below to submit your details.',
        labelLanguage: 'Language',
        labelName: 'Name',
        labelDOB: 'Date of Birth',
        labelFatherName: 'Father Name',
        placeholderName: 'Enter your name',
        placeholderDOB: 'DD/MM/YYYY',
        placeholderFatherName: 'Enter your father\'s name',
        btnSubmit: 'Submit',
        btnExit: 'Exit',
        status_emptyFields: 'Please fill out all fields.',
        status_invalidDOB: 'Please enter Date of Birth in DD/MM/YYYY format.',
        status_initError: 'Error: Firebase is not initialized or user is not authenticated.',
        status_submitError: 'Error submitting data. Please try again.',
        status_success: 'Data submitted successfully!',
        status_exit: 'Exiting the form.',
    },
    'Burmese': {
        headerTitle: 'ကိုယ်ရေးအချက်အလက် ထည့်သွင်းခြင်း',
        headerDescription: 'ကျေးဇူးပြု၍ သင်၏ကိုယ်ရေးအချက်အလက်များကို ပေးပို့ရန် အောက်ဖော်ပြပါ ဖောင်ကိုဖြည့်ပါ။',
        labelLanguage: 'ဘာသာစကား',
        labelName: 'အမည်',
        labelDOB: 'မွေးသက္ကရာဇ်',
        labelFatherName: 'အဖေအမည်',
        placeholderName: 'သင်၏အမည်ကိုရိုက်ထည့်ပါ',
        placeholderDOB: 'နေ့/လ/နှစ်',
        placeholderFatherName: 'သင်၏အဖေအမည်ကိုရိုက်ထည့်ပါ',
        btnSubmit: 'တင်ပြပါ',
        btnExit: 'ထွက်ရန်',
        status_emptyFields: 'ကျေးဇူးပြု၍ အချက်အလက်အားလုံးကို ဖြည့်ပါ။',
        status_invalidDOB: 'ကျေးဇူးပြု၍ မွေးသက္ကရာဇ်ကို နေ့/လ/နှစ် ပုံစံဖြင့် ထည့်ပါ။',
        status_initError: 'အမှား- စင်တာနှင့် ချိတ်ဆက်မထားပါ။ သို့မဟုတ် အသုံးပြုသူကို အတည်မပြုထားပါ။',
        status_submitError: 'အချက်အလက်ပေးပို့ရာတွင် အမှားဖြစ်ခဲ့ပါသည်။ ကျေးဇူးပြု၍ ထပ်မံကြိုးစားပါ။',
        status_success: 'အချက်အလက် ပေးပို့မှု အောင်မြင်ပါသည်။',
        status_exit: 'ဖောင်မှ ထွက်ရန် ဘရောက်ဆာ(browser)ကို ပိတ်ပါ။ ',
    },
    'Thai': {
        headerTitle: 'การรวบรวมข้อมูล',
        headerDescription: 'โปรดกรอกแบบฟอร์มด้านล่างเพื่อส่งรายละเอียดของคุณ',
        labelLanguage: 'ภาษา',
        labelName: 'ชื่อ',
        labelDOB: 'วันเกิด',
        labelFatherName: 'ชื่อบิดา',
        placeholderName: 'กรุณาใส่ชื่อของคุณ',
        placeholderDOB: 'วว/ดด/ปปปป (พ.ศ.)',
        placeholderFatherName: 'กรุณาใส่ชื่อบิดาของคุณ',
        btnSubmit: 'ส่งข้อมูล',
        btnExit: 'ออก',
        status_emptyFields: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        status_invalidDOB: 'โปรดป้อนวันเกิดในรูปแบบ วว/ดด/ปปปป',
        status_initError: 'ข้อผิดพลาด: Firebase ไม่ได้เริ่มต้นหรือผู้ใช้ไม่ได้ลงชื่อเข้าใช้',
        status_submitError: 'ข้อผิดพลาดในการส่งข้อมูล โปรดลองอีกครั้ง',
        status_success: 'ส่งข้อมูลสำเร็จแล้ว!',
        status_exit: 'กำลังออกจากแบบฟอร์ม',
    },
};

// The main application component.
const App = () => {
    // State to hold the user's data.
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [fatherName, setFatherName] = useState('');
    // State for language selection.
    const [language, setLanguage] = useState('English');

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

    // Function to validate the date of birth in DD/MM/YYYY (Gregorian).
    const validateDob = (dateString) => {
        // Regex for DD/MM/YYYY format.
        const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
        return regex.test(dateString);
    };

    // Function to validate the date of birth in วว/ดด/ปปปป (Thai Buddhist Era).
    const validateThaiDob = (dateString) => {
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = dateString.match(regex);
        if (!match) return false;

        let day = parseInt(match[1], 10);
        let month = parseInt(match[2], 10);
        let year = parseInt(match[3], 10);

        // Convert Buddhist year to Gregorian year by subtracting 543.
        // This is necessary for accurate date validation.
        year = year - 543;

        // Check if the date is valid after converting to Gregorian.
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
    };


    // Function to handle form submission.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('');
        const currentTranslations = translations[language];

        if (!db || !userId) {
            setStatusMessage(currentTranslations.status_initError);
            return;
        }

        if (!name || !dob || !fatherName) {
            setStatusMessage(currentTranslations.status_emptyFields);
            return;
        }

        // Validate DOB based on the selected language.
        let isValidDate = false;
        if (language === 'Thai') {
            isValidDate = validateThaiDob(dob);
        } else {
            isValidDate = validateDob(dob);
        }

        if (!isValidDate) {
            setStatusMessage(currentTranslations.status_invalidDOB);
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
                // Add the selected language to the document.
                language: language,
            });
            console.log("Document written with ID:", docRef.id);
            setStatusMessage(currentTranslations.status_success);

            // Clear the form fields after successful submission.
            setName('');
            setDob('');
            setFatherName('');

        } catch (error) {
            console.error("Error adding document:", error);
            setStatusMessage(currentTranslations.status_submitError);
        }
    };

    // Function to handle the "Exit" button click.
    const handleExit = () => {
        const currentTranslations = translations[language];
        setStatusMessage(currentTranslations.status_exit);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="text-gray-700 text-xl">Loading...</div>
            </div>
        );
    }

    const currentTranslations = translations[language];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{currentTranslations.headerTitle}</h1>
                    <p className="text-sm text-gray-500">{currentTranslations.headerDescription}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="language" className="block text-sm font-semibold text-gray-700">
                            {currentTranslations.labelLanguage}
                        </label>
                        <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="English">English</option>
                            <option value="Burmese">Burmese</option>
                            <option value="Thai">Thai</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                            {currentTranslations.labelName}
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={currentTranslations.placeholderName}
                        />
                    </div>
                    <div>
                        <label htmlFor="dob" className="block text-sm font-semibold text-gray-700">
                            {currentTranslations.labelDOB}
                        </label>
                        <input
                            type="text"
                            id="dob"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={currentTranslations.placeholderDOB}
                        />
                    </div>
                    <div>
                        <label htmlFor="fatherName" className="block text-sm font-semibold text-gray-700">
                            {currentTranslations.labelFatherName}
                        </label>
                        <input
                            type="text"
                            id="fatherName"
                            value={fatherName}
                            onChange={(e) => setFatherName(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={currentTranslations.placeholderFatherName}
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
                            {currentTranslations.btnSubmit}
                        </button>
                        <button
                            type="button"
                            onClick={handleExit}
                            className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            {currentTranslations.btnExit}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    ReactDOM.render(<App />, container);
}

export default App;
