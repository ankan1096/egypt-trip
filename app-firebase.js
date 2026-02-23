// Egypt Trip Itinerary - Real-time Multi-user Sync with Firebase
// All 4 users will see changes in real-time

import firebaseConfig from './firebase-config.js';

class ItineraryManager {
    constructor() {
        this.db = null;
        this.itineraryRef = null;
        this.editMode = false;
        this.currentUser = this.getUserIdentity();
        this.initFirebase();
    }

    // Get or create user identity
    getUserIdentity() {
        let userId = localStorage.getItem('egyptTripUserId');
        if (!userId) {
            userId = 'User_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('egyptTripUserId', userId);
        }
        return userId;
    }

    // Initialize Firebase
    async initFirebase() {
        try {
            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            this.db = firebase.database();
            this.itineraryRef = this.db.ref('egyptTrip2026/itinerary');
            
            // Check if itinerary exists, if not create default
            const snapshot = await this.itineraryRef.once('value');
            if (!snapshot.exists()) {
                await this.itineraryRef.set(this.getDefaultItinerary());
            }
            
            // Listen for real-time updates
            this.setupRealtimeListener();
            
            // Setup UI
            this.setupEventListeners();
            this.updateEditModeButton();
            
            // Show connection status
            this.setupConnectionStatus();
            
        } catch (error) {
            console.error('Firebase initialization error:', error);
            alert('Error connecting to database. Please check your Firebase configuration.');
        }
    }

    // Setup real-time listener for changes
    setupRealtimeListener() {
        this.itineraryRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                this.renderItinerary(data);
                this.showUpdateNotification();
            }
        });
    }

    // Setup connection status indicator
    setupConnectionStatus() {
        const connectedRef = firebase.database().ref('.info/connected');
        connectedRef.on('value', (snap) => {
            const statusEl = document.getElementById('connection-status');
            if (statusEl) {
                if (snap.val() === true) {
                    statusEl.textContent = '🟢 Connected';
                    statusEl.className = 'status-connected';
                } else {
                    statusEl.textContent = '🔴 Disconnected';
                    statusEl.className = 'status-disconnected';
                }
            }
        });
    }

    // Show notification when data updates
    showUpdateNotification() {
        const notification = document.getElementById('update-notification');
        if (notification && !this.editMode) {
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }
    }

    // Default itinerary data
    getDefaultItinerary() {
        return [
            {
                id: 1,
                day: "Day 1: November 24 (Monday)",
                location: "Arrival in Cairo",
                activities: [
                    { id: 1, time: "Morning/Afternoon", description: "Both groups arrive at Cairo Airport, meet, transfer to hotel in Giza area" },
                    { id: 2, time: "Evening", description: "Welcome dinner at local Egyptian restaurant, rest" }
                ],
                cost: 65
            },
            {
                id: 2,
                day: "Day 2: November 25 (Tuesday)",
                location: "Pyramids & Cairo",
                activities: [
                    { id: 1, time: "Morning", description: "Great Pyramids of Giza, Sphinx, optional camel ride" },
                    { id: 2, time: "Afternoon", description: "Egyptian Museum (Tutankhamun treasures, mummy rooms)" },
                    { id: 3, time: "Evening", description: "Khan El Khalili Bazaar, traditional dinner" }
                ],
                cost: 97
            },
            {
                id: 3,
                day: "Day 3: November 26 (Wednesday)",
                location: "Cairo to Luxor",
                activities: [
                    { id: 1, time: "Morning", description: "Optional visit to Saqqara & Memphis, transfer to airport" },
                    { id: 2, time: "Afternoon", description: "Flight to Luxor, check-in to Nile Cruise ship" },
                    { id: 3, time: "Evening", description: "Visit illuminated Luxor Temple, dinner on cruise" }
                ],
                cost: 120
            },
            {
                id: 4,
                day: "Day 4: November 27 (Thursday)",
                location: "Luxor West Bank",
                activities: [
                    { id: 1, time: "Morning", description: "Valley of the Kings, Temple of Hatshepsut, Colossi of Memnon" },
                    { id: 2, time: "Afternoon", description: "Cruise sails towards Edfu, relax on sun deck" },
                    { id: 3, time: "Evening", description: "Egyptian folklore show, overnight sailing" }
                ],
                cost: 33
            },
            {
                id: 5,
                day: "Day 5: November 28 (Friday)",
                location: "Edfu & Kom Ombo",
                activities: [
                    { id: 1, time: "Morning", description: "Edfu Temple (best-preserved temple), horse carriage ride" },
                    { id: 2, time: "Afternoon", description: "Cruise to Kom Ombo, visit unique double temple" },
                    { id: 3, time: "Evening", description: "Sail to Aswan, dinner on cruise" }
                ],
                cost: 23
            },
            {
                id: 6,
                day: "Day 6: November 29 (Saturday)",
                location: "Aswan to Hurghada",
                activities: [
                    { id: 1, time: "Morning", description: "Aswan High Dam, Philae Temple (boat ride to island)" },
                    { id: 2, time: "Afternoon", description: "Check out from cruise, optional Nubian Village visit" },
                    { id: 3, time: "Evening", description: "Flight to Hurghada, check-in to beach resort" }
                ],
                cost: 180
            },
            {
                id: 7,
                day: "Day 7: November 30 (Sunday)",
                location: "Hurghada Beach Day",
                activities: [
                    { id: 1, time: "Morning", description: "Beach relaxation, optional snorkeling trip to Giftun Island" },
                    { id: 2, time: "Afternoon", description: "Water sports (scuba diving, parasailing, quad biking)" },
                    { id: 3, time: "Evening", description: "Sunset at beach, explore Hurghada Marina" }
                ],
                cost: 80
            },
            {
                id: 8,
                day: "Day 8: December 1 (Monday)",
                location: "Departure",
                activities: [
                    { id: 1, time: "Morning", description: "Breakfast, check out, last-minute shopping" },
                    { id: 2, time: "Afternoon", description: "Flight to Cairo, connect to international flights" },
                    { id: 3, time: "Evening", description: "Return flights to Bangalore and Kolkata" }
                ],
                cost: 122
            }
        ];
    }

    // Render the entire itinerary
    renderItinerary(itinerary) {
        const container = document.getElementById('itinerary-container');
        if (!container) return;

        container.innerHTML = itinerary.map(day => this.renderDayCard(day)).join('');
    }

    // Render a single day card
    renderDayCard(day) {
        const activitiesHtml = day.activities.map(activity => `
            <p>
                <strong>${activity.time}:</strong> ${activity.description}
                ${this.editMode ? `
                    <button class="btn-icon btn-edit" onclick="itineraryManager.editActivity(${day.id}, ${activity.id})" title="Edit activity">✏️</button>
                    <button class="btn-icon btn-delete" onclick="itineraryManager.deleteActivity(${day.id}, ${activity.id})" title="Delete activity">🗑️</button>
                ` : ''}
            </p>
        `).join('');

        return `
            <div class="day-card" data-day-id="${day.id}">
                <div class="day-header">
                    <h3>${day.day}</h3>
                    <span class="location">${day.location}</span>
                </div>
                <div class="day-content">
                    ${activitiesHtml}
                    ${this.editMode ? `
                        <button class="btn-add-activity" onclick="itineraryManager.addActivity(${day.id})">
                            ➕ Add Activity
                        </button>
                    ` : ''}
                    <p class="cost">Cost: USD ${day.cost} per person</p>
                </div>
            </div>
        `;
    }

    // Setup event listeners
    setupEventListeners() {
        const toggleBtn = document.getElementById('toggle-edit-mode');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleEditMode());
        }

        const resetBtn = document.getElementById('reset-itinerary');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetItinerary());
        }

        const exportBtn = document.getElementById('export-itinerary');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportItinerary());
        }
    }

    // Toggle edit mode
    toggleEditMode() {
        this.editMode = !this.editMode;
        this.itineraryRef.once('value').then(snapshot => {
            this.renderItinerary(snapshot.val());
        });
        this.updateEditModeButton();
    }

    // Update edit mode button text
    updateEditModeButton() {
        const btn = document.getElementById('toggle-edit-mode');
        if (btn) {
            btn.textContent = this.editMode ? '✓ Done Editing' : '✏️ Edit Itinerary';
            btn.classList.toggle('active', this.editMode);
        }
    }

    // Add new activity to a day
    async addActivity(dayId) {
        const time = prompt('Enter time (e.g., Morning, Afternoon, Evening):');
        if (!time) return;

        const description = prompt('Enter activity description:');
        if (!description) return;

        try {
            const snapshot = await this.itineraryRef.once('value');
            const itinerary = snapshot.val();
            const dayIndex = itinerary.findIndex(d => d.id === dayId);
            
            if (dayIndex !== -1) {
                const day = itinerary[dayIndex];
                const newId = Math.max(...day.activities.map(a => a.id), 0) + 1;
                day.activities.push({ id: newId, time, description });
                
                // Update Firebase
                await this.itineraryRef.set(itinerary);
                this.logActivity(`${this.currentUser} added activity to ${day.day}`);
            }
        } catch (error) {
            console.error('Error adding activity:', error);
            alert('Error adding activity. Please try again.');
        }
    }

    // Edit an existing activity
    async editActivity(dayId, activityId) {
        try {
            const snapshot = await this.itineraryRef.once('value');
            const itinerary = snapshot.val();
            const dayIndex = itinerary.findIndex(d => d.id === dayId);
            
            if (dayIndex !== -1) {
                const day = itinerary[dayIndex];
                const activityIndex = day.activities.findIndex(a => a.id === activityId);
                
                if (activityIndex !== -1) {
                    const activity = day.activities[activityIndex];
                    
                    const newTime = prompt('Edit time:', activity.time);
                    if (newTime === null) return;
                    
                    const newDescription = prompt('Edit description:', activity.description);
                    if (newDescription === null) return;
                    
                    activity.time = newTime;
                    activity.description = newDescription;
                    
                    // Update Firebase
                    await this.itineraryRef.set(itinerary);
                    this.logActivity(`${this.currentUser} edited activity in ${day.day}`);
                }
            }
        } catch (error) {
            console.error('Error editing activity:', error);
            alert('Error editing activity. Please try again.');
        }
    }

    // Delete an activity
    async deleteActivity(dayId, activityId) {
        if (!confirm('Are you sure you want to delete this activity? This will affect all users.')) return;

        try {
            const snapshot = await this.itineraryRef.once('value');
            const itinerary = snapshot.val();
            const dayIndex = itinerary.findIndex(d => d.id === dayId);
            
            if (dayIndex !== -1) {
                const day = itinerary[dayIndex];
                day.activities = day.activities.filter(a => a.id !== activityId);
                
                // Update Firebase
                await this.itineraryRef.set(itinerary);
                this.logActivity(`${this.currentUser} deleted activity from ${day.day}`);
            }
        } catch (error) {
            console.error('Error deleting activity:', error);
            alert('Error deleting activity. Please try again.');
        }
    }

    // Reset to default itinerary
    async resetItinerary() {
        if (!confirm('Are you sure you want to reset to the default itinerary? This will affect all users and all changes will be lost.')) return;

        try {
            await this.itineraryRef.set(this.getDefaultItinerary());
            this.logActivity(`${this.currentUser} reset itinerary to default`);
            alert('Itinerary has been reset to default for all users!');
        } catch (error) {
            console.error('Error resetting itinerary:', error);
            alert('Error resetting itinerary. Please try again.');
        }
    }

    // Export itinerary as JSON file
    async exportItinerary() {
        try {
            const snapshot = await this.itineraryRef.once('value');
            const itinerary = snapshot.val();
            
            const dataStr = JSON.stringify(itinerary, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'egypt-trip-itinerary.json';
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting itinerary:', error);
            alert('Error exporting itinerary. Please try again.');
        }
    }

    // Log activity for tracking
    logActivity(message) {
        const activityLog = this.db.ref('egyptTrip2026/activityLog');
        activityLog.push({
            message: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    }
}

// Initialize when DOM is ready
let itineraryManager;
document.addEventListener('DOMContentLoaded', () => {
    itineraryManager = new ItineraryManager();
});