// Admin configuration
const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password in production

// Platforms configuration
const platforms = ['Bubble', 'Webflow', 'Adalo', 'Glide', 'Softr', 'Wix', 'Others'];

// Check if user is admin
function isAdmin() {
    return localStorage.getItem('isAdmin') === 'true';
}

// Initialize votes in localStorage if not exists
function initVotes() {
    if (!localStorage.getItem('votes')) {
        const initialVotes = {
            teams: {},
            platforms: {
                'Bubble': 0,
                'Webflow': 0,
                'Adalo': 0,
                'Glide': 0,
                'Softr': 0,
                'Wix': 0,
                'Others': 0
            }
        };
        localStorage.setItem('votes', JSON.stringify(initialVotes));
    }
}

// Submit vote
function submitVote(team, platform) {
    try {
        const votes = JSON.parse(localStorage.getItem('votes') || '{}');

        // Initialize votes object if it doesn't exist
        if (!votes.teams) votes.teams = {};
        if (!votes.platforms) votes.platforms = {};

        // Check if team has already voted
        if (votes.teams[team]) {
            alert('This team has already voted!');
            return false;
        }

        // Record the vote
        votes.teams[team] = platform;
        votes.platforms[platform] = (votes.platforms[platform] || 0) + 1;
        localStorage.setItem('votes', JSON.stringify(votes));

        return true;
    } catch (error) {
        console.error('Error submitting vote:', error);
        alert('There was an error submitting your vote. Please try again.');
        return false;
    }
}

// Check if user has already voted
function hasVoted() {
    return document.cookie.includes('voted=true');
}

// Handle admin login
function handleLogin() {
    const password = document.getElementById('admin-password').value;
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('isAdmin', 'true');
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('results-container').classList.remove('hidden');
    } else {
        alert('Incorrect password');
    }
}

// Handle admin logout
function handleLogout() {
    localStorage.removeItem('isAdmin');
    document.getElementById('admin-login').classList.remove('hidden');
    document.getElementById('results-container').classList.add('hidden');
    document.getElementById('admin-password').value = '';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize votes
    initVotes();

    // Set up vote submission
    const submitButton = document.getElementById('submit-vote');
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            const teamSelect = document.getElementById('team-select');
            const selectedTeam = teamSelect.value;

            if (!selectedTeam) {
                alert('Please select your team');
                return;
            }

            const selectedPlatform = document.querySelector('input[name="platform"]:checked');
            if (!selectedPlatform) {
                alert('Please select a platform');
                return;
            }

            if (submitVote(selectedTeam, selectedPlatform.value)) {
                // Show thank you message
                document.getElementById('voting-form').classList.add('hidden');
                document.getElementById('thank-you').classList.remove('hidden');
            }
        });
    } else {
        console.error('Submit button not found!');
    }

    // Set up admin login
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Check if already logged in as admin
    if (isAdmin()) {
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('results-container').classList.remove('hidden');
    }
}); 