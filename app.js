// Egypt Trip Itinerary - Interactive Features
// Persistent storage using localStorage

class ItineraryManager {
    constructor() {
        this.storageKey = 'egyptTripItinerary';
        this.itinerary = this.loadItinerary();
        this.editMode = false;
        this.init();
    }

    init() {
        this.renderItinerary();
        this.setupEventListeners();
        this.updateEditModeButton();
    }

    // Load itinerary from localStorage or use default
    loadItinerary() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            return JSON.parse(saved);
        }
        return this.getDefaultItinerary();
    }

    // Save itinerary to localStorage
    saveItinerary() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.itinerary));
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
    renderItinerary() {
        const container = document.getElementById('itinerary-container');
        if (!container) return;

        container.innerHTML = this.itinerary.map(day => this.renderDayCard(day)).join('');
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

        const importBtn = document.getElementById('import-itinerary');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importItinerary());
        }
    }

    // Toggle edit mode
    toggleEditMode() {
        this.editMode = !this.editMode;
        this.renderItinerary();
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
    addActivity(dayId) {
        const time = prompt('Enter time (e.g., Morning, Afternoon, Evening):');
        if (!time) return;

        const description = prompt('Enter activity description:');
        if (!description) return;

        const day = this.itinerary.find(d => d.id === dayId);
        if (day) {
            const newId = Math.max(...day.activities.map(a => a.id), 0) + 1;
            day.activities.push({ id: newId, time, description });
            this.saveItinerary();
            this.renderItinerary();
        }
    }

    // Edit an existing activity
    editActivity(dayId, activityId) {
        const day = this.itinerary.find(d => d.id === dayId);
        if (!day) return;

        const activity = day.activities.find(a => a.id === activityId);
        if (!activity) return;

        const newTime = prompt('Edit time:', activity.time);
        if (newTime === null) return;

        const newDescription = prompt('Edit description:', activity.description);
        if (newDescription === null) return;

        activity.time = newTime;
        activity.description = newDescription;
        this.saveItinerary();
        this.renderItinerary();
    }

    // Delete an activity
    deleteActivity(dayId, activityId) {
        if (!confirm('Are you sure you want to delete this activity?')) return;

        const day = this.itinerary.find(d => d.id === dayId);
        if (day) {
            day.activities = day.activities.filter(a => a.id !== activityId);
            this.saveItinerary();
            this.renderItinerary();
        }
    }

    // Reset to default itinerary
    resetItinerary() {
        if (!confirm('Are you sure you want to reset to the default itinerary? All changes will be lost.')) return;

        this.itinerary = this.getDefaultItinerary();
        this.saveItinerary();
        this.renderItinerary();
        alert('Itinerary has been reset to default!');
    }

    // Export itinerary as JSON file
    exportItinerary() {
        const dataStr = JSON.stringify(this.itinerary, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'egypt-trip-itinerary.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    // Import itinerary from JSON file
    importItinerary() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    if (Array.isArray(imported) && imported.length > 0) {
                        this.itinerary = imported;
                        this.saveItinerary();
                        this.renderItinerary();
                        alert('Itinerary imported successfully!');
                    } else {
                        alert('Invalid itinerary format!');
                    }
                } catch (error) {
                    alert('Error importing itinerary: ' + error.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
}

// Initialize when DOM is ready
let itineraryManager;
document.addEventListener('DOMContentLoaded', () => {
    itineraryManager = new ItineraryManager();
});