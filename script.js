// Toggle sidebar on mobile
const toggle = document.querySelector('.menu-toggle');
const sidebar = document.getElementById('sidebar');

toggle.addEventListener('click', () => {
  sidebar.classList.toggle('show');
});

// Initialize data storage
const initialData = {
  employees: [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', phone: '555-123-4567', 
      availability: {
        monday: { morning: true, afternoon: true, evening: false },
        tuesday: { morning: true, afternoon: true, evening: false },
        wednesday: { morning: false, afternoon: true, evening: false },
        thursday: { morning: true, afternoon: true, evening: false },
        friday: { morning: true, afternoon: false, evening: false },
        saturday: { morning: false, afternoon: false, evening: false },
        sunday: { morning: false, afternoon: false, evening: false },
      }
    },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-987-6543',
      availability: {
        monday: { morning: false, afternoon: true, evening: true },
        tuesday: { morning: false, afternoon: true, evening: true },
        wednesday: { morning: false, afternoon: false, evening: true },
        thursday: { morning: false, afternoon: true, evening: true },
        friday: { morning: false, afternoon: true, evening: true },
        saturday: { morning: false, afternoon: false, evening: false },
        sunday: { morning: false, afternoon: false, evening: false },
      }
    },
  ],
  shifts: [
    { id: 1, date: '2025-04-21', start: '09:00', end: '17:00', employeeId: 1 },
    { id: 2, date: '2025-04-22', start: '13:00', end: '21:00', employeeId: 2 },
    { id: 3, date: '2025-04-23', start: '17:00', end: '22:00', employeeId: 1 },
  ],
  settings: {
    emailNotifications: true,
    darkMode: false
  }
};

// Check if data exists in localStorage, otherwise initialize
if (!localStorage.getItem('scheduloopData')) {
  localStorage.setItem('scheduloopData', JSON.stringify(initialData));
}

// Function to get data from localStorage
function getData() {
  return JSON.parse(localStorage.getItem('scheduloopData'));
}

// Function to save data to localStorage
function saveData(data) {
  localStorage.setItem('scheduloopData', JSON.stringify(data));
}

// DOM elements
const loginModal = document.getElementById('login-modal');
const loginButton = document.getElementById('login-button');
const loginError = document.getElementById('login-error');
const logoutButton = document.getElementById('logout-button');
const menuToggle = document.querySelector('.menu-toggle');
const navItems = document.querySelectorAll('#sidebar li');
const pages = document.querySelectorAll('.page');
const contentArea = document.querySelector('.container');

// Authentication
function checkAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
    // Show login modal and hide main content
    loginModal.style.display = 'block';
    contentArea.style.display = 'none';
    logoutButton.classList.add('hidden');
  } else {
    // Hide login modal and show main content
    loginModal.style.display = 'none';
    contentArea.style.display = 'flex';
    logoutButton.classList.remove('hidden');
    loadData();
  }
}

loginButton.addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (username === 'admin' && password === 'password') {
    localStorage.setItem('isLoggedIn', 'true');
    loginModal.style.display = 'none';
    contentArea.style.display = 'flex';
    logoutButton.classList.remove('hidden');
    loadData();
  } else {
    loginError.textContent = 'Invalid username or password';
  }
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('isLoggedIn');
  checkAuth();
});

// Navigation
navItems.forEach(item => {
  item.addEventListener('click', () => {
    const pageId = item.getAttribute('data-page');
    
    // Update active nav item
    navItems.forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
    
    // Show selected page
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageId}-page`).classList.add('active');
    
    // On mobile, hide sidebar after selection
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('active');
    }
  });
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Load data into UI
function loadData() {
  loadEmployees();
  loadShiftsCalendar();
  loadAvailability();
  loadSettings();
}

// EMPLOYEE FUNCTIONS
function loadEmployees() {
  const employeesList = document.getElementById('employees-list');
  const data = getData();
  
  employeesList.innerHTML = '';
  
  data.employees.forEach(employee => {
    const card = document.createElement('div');
    card.className = 'employee-card';
    card.innerHTML = `
      <h3>${employee.name}</h3>
      <p>Email: ${employee.email}</p>
      <p>Phone: ${employee.phone || 'N/A'}</p>
      <div class="employee-actions">
        <button class="edit-btn" data-id="${employee.id}">Edit</button>
        <button class="delete-btn" data-id="${employee.id}">Delete</button>
      </div>
    `;
    employeesList.appendChild(card);
  });
  
  // Add event listeners
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      openEmployeeModal('edit', id);
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      deleteEmployee(id);
    });
  });
}

// Add Employee button
document.getElementById('add-employee-btn').addEventListener('click', () => {
  openEmployeeModal('add');
});

// Employee Modal
function openEmployeeModal(mode, employeeId = null) {
  const modal = document.getElementById('employee-modal');
  const form = document.getElementById('employee-form');
  const title = document.getElementById('employee-modal-title');
  const availabilityForm = document.getElementById('availability-form');
  
  // Set modal title based on mode
  title.textContent = mode === 'add' ? 'Add Employee' : 'Edit Employee';
  
  // Clear previous form data
  form.reset();
  availabilityForm.innerHTML = '';
  
  // Generate availability form
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const timeSlots = ['morning', 'afternoon', 'evening'];
  
  daysOfWeek.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.innerHTML = `<h4>${day.charAt(0).toUpperCase() + day.slice(1)}</h4>`;
    
    timeSlots.forEach(slot => {
      const label = document.createElement('label');
      label.innerHTML = `
        <input type="checkbox" name="availability-${day}-${slot}"> 
        ${slot.charAt(0).toUpperCase() + slot.slice(1)}
      `;
      dayDiv.appendChild(label);
    });
    
    availabilityForm.appendChild(dayDiv);
  });
  
  // If editing, populate form with employee data
  if (mode === 'edit' && employeeId) {
    const data = getData();
    const employee = data.employees.find(emp => emp.id === employeeId);
    
    if (employee) {
      document.getElementById('employee-id').value = employee.id;
      document.getElementById('employee-name').value = employee.name;
      document.getElementById('employee-email').value = employee.email;
      document.getElementById('employee-phone').value = employee.phone || '';
      
      // Check availability checkboxes
      for (const day in employee.availability) {
        for (const slot in employee.availability[day]) {
          const checkbox = document.querySelector(`input[name="availability-${day}-${slot}"]`);
          if (checkbox && employee.availability[day][slot]) {
            checkbox.checked = true;
          }
        }
      }
    }
  }
  
  // Show modal
  modal.style.display = 'block';
  
  // Close modal when clicking on X
  document.querySelector('#employee-modal .close').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Form submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = getData();
    const name = document.getElementById('employee-name').value;
    const email = document.getElementById('employee-email').value;
    const phone = document.getElementById('employee-phone').value;
    
    // Build availability object
    const availability = {};
    daysOfWeek.forEach(day => {
      availability[day] = {};
      timeSlots.forEach(slot => {
        const checkbox = document.querySelector(`input[name="availability-${day}-${slot}"]`);
        availability[day][slot] = checkbox.checked;
      });
    });
    
    if (mode === 'add') {
      // Generate new ID
      const newId = data.employees.length > 0 ? Math.max(...data.employees.map(emp => emp.id)) + 1 : 1;
      
      // Add new employee
      data.employees.push({
        id: newId,
        name,
        email,
        phone,
        availability
      });
    } else if (mode === 'edit') {
      // Update existing employee
      const id = parseInt(document.getElementById('employee-id').value);
      const empIndex = data.employees.findIndex(emp => emp.id === id);
      
      if (empIndex !== -1) {
        data.employees[empIndex] = {
          ...data.employees[empIndex],
          name,
          email,
          phone,
          availability
        };
      }
    }
    
    // Save data and reload UI
    saveData(data);
    loadEmployees();
    loadAvailability();
    
    // Close modal
    modal.style.display = 'none';
  });
}

function deleteEmployee(id) {
  if (confirm('Are you sure you want to delete this employee?')) {
    const data = getData();
    
    // Remove employee
    data.employees = data.employees.filter(emp => emp.id !== id);
    
    // Remove shifts assigned to this employee
    data.shifts = data.shifts.filter(shift => shift.employeeId !== id);
    
    // Save data and reload UI
    saveData(data);
    loadEmployees();
    loadShiftsCalendar();
    loadAvailability();
  }
}

// SHIFTS FUNCTIONS
function loadShiftsCalendar() {
  const calendar = document.getElementById('shifts-calendar');
  const data = getData();
  
  // Clear calendar
  calendar.innerHTML = '';
  
  // Get current week
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - currentDay); // Set to previous Sunday
  
  // Add day headers
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  daysOfWeek.forEach(day => {
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.textContent = day;
    calendar.appendChild(header);
  });
  
  // Add calendar days
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day';
    dayCell.setAttribute('data-date', date.toISOString().split('T')[0]);
    
    // Add date to cell
    const dateHeader = document.createElement('div');
    dateHeader.className = 'date-header';
    dateHeader.textContent = `${date.getMonth() + 1}/${date.getDate()}`;
    dayCell.appendChild(dateHeader);
    
    // Add shifts for this day
    const dayShifts = data.shifts.filter(shift => shift.date === date.toISOString().split('T')[0]);
    dayShifts.forEach(shift => {
      const employee = data.employees.find(emp => emp.id === shift.employeeId);
      const shiftItem = document.createElement('div');
      shiftItem.className = 'shift-item';
      shiftItem.textContent = `${shift.start}-${shift.end}: ${employee ? employee.name : 'Unknown'}`;
      
      // Add click to edit
      shiftItem.addEventListener('click', () => {
        openShiftModal('edit', shift.id);
      });
      
      dayCell.appendChild(shiftItem);
    });
    
    // Add button to add shift
    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.className = 'add-shift-btn';
    addButton.addEventListener('click', () => {
      openShiftModal('add', null, date.toISOString().split('T')[0]);
    });
    dayCell.appendChild(addButton);
    
    calendar.appendChild(dayCell);
  }
}

function openShiftModal(mode, shiftId = null, date = null) {
  const modal = document.getElementById('shift-modal');
  const form = document.getElementById('shift-form');
  const employeeSelect = document.getElementById('shift-employee');
  const data = getData();
  
  // Clear previous form data
  form.reset();
  
  // Populate employee dropdown
  employeeSelect.innerHTML = '<option value="">Select Employee</option>';
  data.employees.forEach(employee => {
    const option = document.createElement('option');
    option.value = employee.id;
    option.textContent = employee.name;
    employeeSelect.appendChild(option);
  });
  
  // If editing, populate form with shift data
  if (mode === 'edit' && shiftId) {
    const shift = data.shifts.find(s => s.id === shiftId);
    
    if (shift) {
      document.getElementById('shift-date').value = shift.date;
      document.getElementById('shift-start').value = shift.start;
      document.getElementById('shift-end').value = shift.end;
      document.getElementById('shift-employee').value = shift.employeeId;
    }
  } else if (mode === 'add' && date) {
    document.getElementById('shift-date').value = date;
  }
  
  // Show modal
  modal.style.display = 'block';
  
  // Close modal when clicking on X
  document.querySelector('#shift-modal .close').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Form submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = getData();
    const date = document.getElementById('shift-date').value;
    const start = document.getElementById('shift-start').value;
    const end = document.getElementById('shift-end').value;
    const employeeId = parseInt(document.getElementById('shift-employee').value);
    
    if (mode === 'add') {
      // Generate new ID
      const newId = data.shifts.length > 0 ? Math.max(...data.shifts.map(s => s.id)) + 1 : 1;
      
      // Add new shift
      data.shifts.push({
        id: newId,
        date,
        start,
        end,
        employeeId
      });
    } else if (mode === 'edit') {
      // Update existing shift
      const id = parseInt(shiftId);
      const shiftIndex = data.shifts.findIndex(s => s.id === id);
      
      if (shiftIndex !== -1) {
        data.shifts[shiftIndex] = {
          ...data.shifts[shiftIndex],
          date,
          start,
          end,
          employeeId
        };
      }
    }
    
    // Save data and reload UI
    saveData(data);
    loadShiftsCalendar();
    
    // Close modal
    modal.style.display = 'none';
  });
}

// AVAILABILITY FUNCTIONS
function loadAvailability() {
  const grid = document.getElementById('availability-grid');
  const data = getData();
  
  // Clear grid
  grid.innerHTML = '';
  
  // Create header row
  const headerRow = document.createElement('div');
  headerRow.className = 'availability-row';
  
  // Employee column header
  const employeeHeader = document.createElement('div');
  employeeHeader.className = 'availability-cell';
  employeeHeader.textContent = 'Employee';
  headerRow.appendChild(employeeHeader);
  
  // Day columns
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  daysOfWeek.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'availability-cell';
    dayHeader.textContent = day;
    headerRow.appendChild(dayHeader);
  });
  
  grid.appendChild(headerRow);
  
  // Create a row for each employee
  data.employees.forEach(employee => {
    const row = document.createElement('div');
    row.className = 'availability-row';
    
    // Employee name
    const nameCell = document.createElement('div');
    nameCell.className = 'availability-cell';
    nameCell.textContent = employee.name;
    row.appendChild(nameCell);
    
    // Days of the week
    daysOfWeek.map(day => day.toLowerCase()).forEach(day => {
      const dayCell = document.createElement('div');
      dayCell.className = 'availability-cell';
      
      // Show availability as M/A/E (Morning/Afternoon/Evening)
      const availability = employee.availability[day];
      const availText = [];
      
      if (availability.morning) availText.push('M');
      if (availability.afternoon) availText.push('A');
      if (availability.evening) availText.push('E');
      
      dayCell.textContent = availText.length ? availText.join('/') : '-';
      row.appendChild(dayCell);
    });
    
    grid.appendChild(row);
  });
}

// SETTINGS FUNCTIONS
function loadSettings() {
  const data = getData();
  const emailNotif = document.getElementById('email-notifications');
  const darkMode = document.getElementById('dark-mode');
  
  emailNotif.checked = data.settings.emailNotifications;
  darkMode.checked = data.settings.darkMode;
  
  // Apply dark mode if enabled
  if (data.settings.darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  
  // Save settings when changed
  emailNotif.addEventListener('change', () => {
    const data = getData();
    data.settings.emailNotifications = emailNotif.checked;
    saveData(data);
  });
  
  darkMode.addEventListener('change', () => {
    const data = getData();
    data.settings.darkMode = darkMode.checked;
    saveData(data);
    
    if (darkMode.checked) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
}

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});

// Close modals when clicking outside (but not the login modal if not logged in)
window.addEventListener('click', (e) => {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    // Don't close login modal if not logged in
    if (modal.id === 'login-modal' && !localStorage.getItem('isLoggedIn')) {
      return;
    }
    
    // Close other modals when clicking outside
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
