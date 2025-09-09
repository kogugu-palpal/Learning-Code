// Get the necessary DOM elements
const jokeContainer = document.getElementById('joke-container');
const GetJokeBtn = document.getElementById('get-joke-btn');
const loadingText = document.getElementById('loading-text');

// Function to fetch a joke from the API
async function fetchJoke() {
    // show loading message and disable the button
    jokeContainer.textContent = '';
    loadingText.classList.remove('hidden');
    GetJokeBtn.disable = true;

    try {
        // Fetch data from tha API
        const response = await fetch('https://icanhazdadjoke.com/', {
            headers: {
                'Accept': 'application/json'
        
            }
        });

        // Check if the response was successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the JSON data
        const data = await response.json();

        // Check is the data contains a joke
        if (data.joke) {
            jokeContainer.textContent = data.joke;
        } else {
            jokeContainer.textContent = 'Sorry, could not find a joke. Try again!'
        }
    } catch (error) {
        console.error('Failed to fetch joke:', error);
        jokeContainer.textContent = 'Opps! Something went wrong. Check the console for more details.';
    } finally {
        // Hide loading message and enable the button
        loadingText.classList.add('hidden');
        GetJokeBtn.disable = false;
    }
}

// Add event listener to the button
GetJokeBtn.addEventListener('click', fetchJoke);

// Fetch a joke when the page loads
window.addEventListener('DOMContentLoaded', fetchJoke);
