// Egypt Trip Itinerary - Real-time Multi-user Sync with Firebase
// All 4 users will see changes in real-time

import firebaseConfig from './firebase-config.js';

class ItineraryManager {
    constructor() {
        this.db = null;
        this.itineraryRef = null;
        this.accommodationsRef = null;
        this.todosRef = null;
        this.editMode = false;
        this.accommodationEditMode = false;
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
            this.accommodationsRef = this.db.ref('egyptTrip2026/accommodations');
            this.todosRef = this.db.ref('egyptTrip2026/todos');
            
            // Check if itinerary exists, if not create default
            const snapshot = await this.itineraryRef.once('value');
            if (!snapshot.exists()) {
                await this.itineraryRef.set(this.getDefaultItinerary());
            }
            
            // Check if accommodations exist, if not create default
            const accomSnapshot = await this.accommodationsRef.once('value');
            if (!accomSnapshot.exists()) {
                await this.accommodationsRef.set(this.getDefaultAccommodations());
            }
            
            // Check if todos exist, if not create default
            const todosSnapshot = await this.todosRef.once('value');
            if (!todosSnapshot.exists()) {
                await this.todosRef.set(this.getDefaultTodos());
            }
            
            // Listen for real-time updates
            this.setupRealtimeListener();
            this.setupAccommodationsListener();
            this.setupTodosListener();
            
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

    // Setup real-time listener for accommodations
    setupAccommodationsListener() {
        this.accommodationsRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                this.renderAccommodations(data);
                this.showAccommodationUpdateNotification();
            }
        });
    }

    // Setup real-time listener for todos
    setupTodosListener() {
        this.todosRef.on('value', (snapshot) => {
            const data = snapshot.val();
            // Always render, even if data is null or empty
            this.renderTodos(data || []);
            if (data && data.length > 0) {
                this.showTodoUpdateNotification();
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

    // Show notification when accommodations update
    showAccommodationUpdateNotification() {
        const notification = document.getElementById('accommodation-update-notification');
        if (notification && !this.accommodationEditMode) {
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }
    }

    // Show notification when todos update
    showTodoUpdateNotification() {
        const notification = document.getElementById('todo-update-notification');
        if (notification) {
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }
    }

    // Default todos data - empty by default
    getDefaultTodos() {
        return [];
    }

    // Default accommodations data
    getDefaultAccommodations() {
        return [
            {
                id: 1,
                name: "Giza Pyramids Hotel",
                location: "Cairo/Giza",
                checkIn: "November 24",
                checkOut: "November 26",
                nights: 2,
                costPerNight: 80,
                totalCost: 160,
                notes: "Near the Pyramids, includes breakfast"
            },
            {
                id: 2,
                name: "Nile Cruise Ship",
                location: "Luxor to Aswan",
                checkIn: "November 26",
                checkOut: "November 29",
                nights: 3,
                costPerNight: 120,
                totalCost: 360,
                notes: "Full board included, all temple visits"
            },
            {
                id: 3,
                name: "Red Sea Resort",
                location: "Hurghada",
                checkIn: "November 29",
                checkOut: "December 1",
                nights: 2,
                costPerNight: 90,
                totalCost: 180,
                notes: "Beach resort, all-inclusive option available"
            }
        ];
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

    // Render todos
    renderTodos(todos) {
        const container = document.getElementById('todo-container');
        if (!container) return;

        if (!todos || todos.length === 0) {
            container.innerHTML = '<p class="no-data">No todo items added yet. Click "Add Todo Item" to get started!</p>';
            return;
        }

        // Sort todos: pending first, then completed
        const sortedTodos = [...todos].sort((a, b) => {
            if (a.status === b.status) {
                // Within same status, sort by priority
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return a.status === 'pending' ? -1 : 1;
        });

        let html = `
            <div class="todo-table-container">
                <table class="todo-table">
                    <thead>
                        <tr>
                            <th style="width: 50px;">Status</th>
                            <th>Task</th>
                            <th style="width: 100px;">Priority</th>
                            <th style="width: 150px;">Created By</th>
                            <th style="width: 120px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        sortedTodos.forEach(todo => {
            html += this.renderTodoRow(todo);
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }

    // Render a single todo row
    renderTodoRow(todo) {
        const priorityColors = {
            high: '#f44336',
            medium: '#ff9800',
            low: '#4caf50'
        };
        
        const priorityColor = priorityColors[todo.priority] || '#9e9e9e';
        const isCompleted = todo.status === 'completed';
        
        return `
            <tr class="todo-row ${isCompleted ? 'completed-row' : ''}" data-todo-id="${todo.id}">
                <td class="todo-checkbox-cell">
                    <input type="checkbox" 
                           id="todo-${todo.id}" 
                           ${isCompleted ? 'checked' : ''} 
                           data-todo-id="${todo.id}"
                           class="todo-checkbox-input">
                </td>
                <td class="todo-text-cell ${isCompleted ? 'strikethrough' : ''}">${todo.text}</td>
                <td class="todo-priority-cell">
                    <span class="todo-priority-badge" style="background-color: ${priorityColor}">
                        ${todo.priority.toUpperCase()}
                    </span>
                </td>
                <td class="todo-creator-cell">${todo.createdBy}</td>
                <td class="todo-actions-cell">
                    <button class="btn-icon btn-edit-todo" data-todo-id="${todo.id}" title="Edit todo">✏️</button>
                    <button class="btn-icon btn-delete-todo" data-todo-id="${todo.id}" title="Delete todo">🗑️</button>
                </td>
            </tr>
        `;
    }

    // Render accommodations
    renderAccommodations(accommodations) {
        const container = document.getElementById('accommodations-container');
        if (!container) return;

        if (!accommodations || accommodations.length === 0) {
            container.innerHTML = '<p class="no-data">No accommodations added yet.</p>';
            return;
        }

        container.innerHTML = accommodations.map(accom => this.renderAccommodationCard(accom)).join('');
    }

    // Render a single accommodation card
    renderAccommodationCard(accom) {
        return `
            <div class="accommodation-card" data-accommodation-id="${accom.id}">
                <div class="accommodation-header">
                    <h3>🏨 ${accom.name}</h3>
                    <span class="accommodation-location">📍 ${accom.location}</span>
                </div>
                <div class="accommodation-content">
                    <div class="accommodation-details">
                        <p><strong>Check-in:</strong> ${accom.checkIn}</p>
                        <p><strong>Check-out:</strong> ${accom.checkOut}</p>
                        <p><strong>Nights:</strong> ${accom.nights}</p>
                        <p><strong>Cost per night:</strong> USD ${accom.costPerNight}</p>
                        <p class="accommodation-total"><strong>Total Cost:</strong> USD ${accom.totalCost}</p>
                        ${accom.notes ? `<p class="accommodation-notes"><em>Notes: ${accom.notes}</em></p>` : ''}
                    </div>
                    ${this.accommodationEditMode ? `
                        <div class="accommodation-actions">
                            <button class="btn-icon btn-edit-accommodation" data-accommodation-id="${accom.id}" title="Edit accommodation">✏️ Edit</button>
                            <button class="btn-icon btn-delete-accommodation" data-accommodation-id="${accom.id}" title="Delete accommodation">🗑️ Delete</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
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
                    <button class="btn-icon btn-edit" data-day-id="${day.id}" data-activity-id="${activity.id}" title="Edit activity">✏️</button>
                    <button class="btn-icon btn-delete" data-day-id="${day.id}" data-activity-id="${activity.id}" title="Delete activity">🗑️</button>
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
                        <button class="btn-add-activity" data-day-id="${day.id}">
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

        // Accommodation controls
        const toggleAccomBtn = document.getElementById('toggle-accommodation-edit');
        if (toggleAccomBtn) {
            toggleAccomBtn.addEventListener('click', () => this.toggleAccommodationEditMode());
        }

        const addAccomBtn = document.getElementById('add-accommodation-btn');
        if (addAccomBtn) {
            addAccomBtn.addEventListener('click', () => this.addAccommodation());
        }

        // Todo controls
        const addTodoBtn = document.getElementById('add-todo-btn');
        if (addTodoBtn) {
            addTodoBtn.addEventListener('click', () => this.addTodo());
        }

        const clearCompletedBtn = document.getElementById('clear-completed-btn');
        if (clearCompletedBtn) {
            clearCompletedBtn.addEventListener('click', () => this.clearCompletedTodos());
        }

        // Setup delegated event listeners for dynamically created buttons
        const itineraryContainer = document.getElementById('itinerary-container');
        if (itineraryContainer) {
            itineraryContainer.addEventListener('click', (e) => {
                // Handle Add Activity button
                if (e.target.classList.contains('btn-add-activity')) {
                    const dayId = parseInt(e.target.getAttribute('data-day-id'));
                    this.addActivity(dayId);
                }
                
                // Handle Edit button
                if (e.target.classList.contains('btn-edit')) {
                    const dayId = parseInt(e.target.getAttribute('data-day-id'));
                    const activityId = parseInt(e.target.getAttribute('data-activity-id'));
                    this.editActivity(dayId, activityId);
                }
                
                // Handle Delete button
                if (e.target.classList.contains('btn-delete')) {
                    const dayId = parseInt(e.target.getAttribute('data-day-id'));
                    const activityId = parseInt(e.target.getAttribute('data-activity-id'));
                    this.deleteActivity(dayId, activityId);
                }
            });
        }

        // Setup delegated event listeners for accommodation buttons
        const accommodationsContainer = document.getElementById('accommodations-container');
        if (accommodationsContainer) {
            accommodationsContainer.addEventListener('click', (e) => {
                // Handle Edit Accommodation button
                if (e.target.classList.contains('btn-edit-accommodation')) {
                    const accomId = parseInt(e.target.getAttribute('data-accommodation-id'));
                    this.editAccommodation(accomId);
                }
                
                // Handle Delete Accommodation button
                if (e.target.classList.contains('btn-delete-accommodation')) {
                    const accomId = parseInt(e.target.getAttribute('data-accommodation-id'));
                    this.deleteAccommodation(accomId);
                }
            });
        }

        // Setup delegated event listeners for todo buttons
        const todoContainer = document.getElementById('todo-container');
        if (todoContainer) {
            todoContainer.addEventListener('click', (e) => {
                // Handle Edit Todo button
                if (e.target.classList.contains('btn-edit-todo')) {
                    const todoId = parseInt(e.target.getAttribute('data-todo-id'));
                    this.editTodo(todoId);
                }
                
                // Handle Delete Todo button
                if (e.target.classList.contains('btn-delete-todo')) {
                    const todoId = parseInt(e.target.getAttribute('data-todo-id'));
                    this.deleteTodo(todoId);
                }
            });

            // Handle checkbox changes
            todoContainer.addEventListener('change', (e) => {
                if (e.target.classList.contains('todo-checkbox-input')) {
                    const todoId = parseInt(e.target.getAttribute('data-todo-id'));
                    this.toggleTodoStatus(todoId);
                }
            });
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

    // Toggle accommodation edit mode
    toggleAccommodationEditMode() {
        this.accommodationEditMode = !this.accommodationEditMode;
        const addBtn = document.getElementById('add-accommodation-btn');
        if (addBtn) {
            addBtn.style.display = this.accommodationEditMode ? 'inline-block' : 'none';
        }
        this.accommodationsRef.once('value').then(snapshot => {
            this.renderAccommodations(snapshot.val());
        });
        this.updateAccommodationEditModeButton();
    }

    // Update accommodation edit mode button text
    updateAccommodationEditModeButton() {
        const btn = document.getElementById('toggle-accommodation-edit');
        if (btn) {
            btn.textContent = this.accommodationEditMode ? '✓ Done Editing' : '✏️ Edit Accommodations';
            btn.classList.toggle('active', this.accommodationEditMode);
        }
    }

    // Add new todo
    async addTodo() {
        const text = prompt('Enter todo item:');
        if (!text || text.trim() === '') return;

        const priority = prompt('Enter priority (high/medium/low):', 'medium');
        if (!priority || !['high', 'medium', 'low'].includes(priority.toLowerCase())) {
            alert('Invalid priority. Please use: high, medium, or low');
            return;
        }

        try {
            const snapshot = await this.todosRef.once('value');
            const todos = snapshot.val() || [];
            const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
            
            todos.push({
                id: newId,
                text: text.trim(),
                status: 'pending',
                priority: priority.toLowerCase(),
                createdBy: this.currentUser,
                createdAt: Date.now()
            });
            
            await this.todosRef.set(todos);
            this.logActivity(`${this.currentUser} added todo: ${text}`);
        } catch (error) {
            console.error('Error adding todo:', error);
            alert('Error adding todo. Please try again.');
        }
    }

    // Edit todo
    async editTodo(todoId) {
        try {
            const snapshot = await this.todosRef.once('value');
            const todos = snapshot.val();
            const todoIndex = todos.findIndex(t => t.id === todoId);
            
            if (todoIndex !== -1) {
                const todo = todos[todoIndex];
                
                const text = prompt('Edit todo text:', todo.text);
                if (text === null) return;
                if (text.trim() === '') {
                    alert('Todo text cannot be empty');
                    return;
                }
                
                const priority = prompt('Edit priority (high/medium/low):', todo.priority);
                if (priority === null) return;
                if (!['high', 'medium', 'low'].includes(priority.toLowerCase())) {
                    alert('Invalid priority. Please use: high, medium, or low');
                    return;
                }
                
                todos[todoIndex] = {
                    ...todo,
                    text: text.trim(),
                    priority: priority.toLowerCase()
                };
                
                await this.todosRef.set(todos);
                this.logActivity(`${this.currentUser} edited todo: ${text}`);
            }
        } catch (error) {
            console.error('Error editing todo:', error);
            alert('Error editing todo. Please try again.');
        }
    }

    // Delete todo
    async deleteTodo(todoId) {
        if (!confirm('Are you sure you want to delete this todo? This will affect all users.')) return;

        try {
            const snapshot = await this.todosRef.once('value');
            const todos = snapshot.val() || [];
            const filtered = todos.filter(t => t.id !== todoId);
            
            // Set to empty array if no items left, Firebase will handle it properly
            await this.todosRef.set(filtered.length > 0 ? filtered : []);
            this.logActivity(`${this.currentUser} deleted a todo`);
        } catch (error) {
            console.error('Error deleting todo:', error);
            alert('Error deleting todo. Please try again.');
        }
    }

    // Toggle todo status
    async toggleTodoStatus(todoId) {
        try {
            const snapshot = await this.todosRef.once('value');
            const todos = snapshot.val();
            const todoIndex = todos.findIndex(t => t.id === todoId);
            
            if (todoIndex !== -1) {
                const todo = todos[todoIndex];
                todos[todoIndex] = {
                    ...todo,
                    status: todo.status === 'pending' ? 'completed' : 'pending'
                };
                
                await this.todosRef.set(todos);
                this.logActivity(`${this.currentUser} ${todos[todoIndex].status === 'completed' ? 'completed' : 'uncompleted'} a todo`);
            }
        } catch (error) {
            console.error('Error toggling todo status:', error);
            alert('Error updating todo status. Please try again.');
        }
    }

    // Clear completed todos
    async clearCompletedTodos() {
        if (!confirm('Are you sure you want to delete all completed todos? This will affect all users.')) return;

        try {
            const snapshot = await this.todosRef.once('value');
            const todos = snapshot.val() || [];
            const filtered = todos.filter(t => t.status !== 'completed');
            
            // Set to empty array if no items left
            await this.todosRef.set(filtered.length > 0 ? filtered : []);
            this.logActivity(`${this.currentUser} cleared completed todos`);
        } catch (error) {
            console.error('Error clearing completed todos:', error);
            alert('Error clearing completed todos. Please try again.');
        }
    }

    // Add new accommodation
    async addAccommodation() {
        const name = prompt('Enter accommodation name:');
        if (!name) return;

        const location = prompt('Enter location:');
        if (!location) return;

        const checkIn = prompt('Enter check-in date:');
        if (!checkIn) return;

        const checkOut = prompt('Enter check-out date:');
        if (!checkOut) return;

        const nights = parseInt(prompt('Enter number of nights:'));
        if (isNaN(nights)) return;

        const costPerNight = parseFloat(prompt('Enter cost per night (USD):'));
        if (isNaN(costPerNight)) return;

        const notes = prompt('Enter notes (optional):') || '';

        try {
            const snapshot = await this.accommodationsRef.once('value');
            const accommodations = snapshot.val() || [];
            const newId = accommodations.length > 0 ? Math.max(...accommodations.map(a => a.id)) + 1 : 1;
            
            accommodations.push({
                id: newId,
                name,
                location,
                checkIn,
                checkOut,
                nights,
                costPerNight,
                totalCost: nights * costPerNight,
                notes
            });
            
            await this.accommodationsRef.set(accommodations);
            this.logActivity(`${this.currentUser} added accommodation: ${name}`);
        } catch (error) {
            console.error('Error adding accommodation:', error);
            alert('Error adding accommodation. Please try again.');
        }
    }

    // Edit accommodation
    async editAccommodation(accomId) {
        try {
            const snapshot = await this.accommodationsRef.once('value');
            const accommodations = snapshot.val();
            const accomIndex = accommodations.findIndex(a => a.id === accomId);
            
            if (accomIndex !== -1) {
                const accom = accommodations[accomIndex];
                
                const name = prompt('Edit name:', accom.name);
                if (name === null) return;
                
                const location = prompt('Edit location:', accom.location);
                if (location === null) return;
                
                const checkIn = prompt('Edit check-in date:', accom.checkIn);
                if (checkIn === null) return;
                
                const checkOut = prompt('Edit check-out date:', accom.checkOut);
                if (checkOut === null) return;
                
                const nights = parseInt(prompt('Edit number of nights:', accom.nights));
                if (isNaN(nights)) return;
                
                const costPerNight = parseFloat(prompt('Edit cost per night (USD):', accom.costPerNight));
                if (isNaN(costPerNight)) return;
                
                const notes = prompt('Edit notes:', accom.notes || '');
                if (notes === null) return;
                
                accommodations[accomIndex] = {
                    ...accom,
                    name,
                    location,
                    checkIn,
                    checkOut,
                    nights,
                    costPerNight,
                    totalCost: nights * costPerNight,
                    notes
                };
                
                await this.accommodationsRef.set(accommodations);
                this.logActivity(`${this.currentUser} edited accommodation: ${name}`);
            }
        } catch (error) {
            console.error('Error editing accommodation:', error);
            alert('Error editing accommodation. Please try again.');
        }
    }

    // Delete accommodation
    async deleteAccommodation(accomId) {
        if (!confirm('Are you sure you want to delete this accommodation? This will affect all users.')) return;

        try {
            const snapshot = await this.accommodationsRef.once('value');
            const accommodations = snapshot.val();
            const filtered = accommodations.filter(a => a.id !== accomId);
            
            await this.accommodationsRef.set(filtered);
            this.logActivity(`${this.currentUser} deleted an accommodation`);
        } catch (error) {
            console.error('Error deleting accommodation:', error);
            alert('Error deleting accommodation. Please try again.');
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
