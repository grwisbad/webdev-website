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
  
  // IMPORTANT: Remove existing event listeners to prevent duplication
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);
  
  // Close modal when clicking on X
  document.querySelector('#employee-modal .close').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Form submit handler
  document.getElementById('employee-form').addEventListener('submit', (e) => {
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
        availability[day][slot] = checkbox ? checkbox.checked : false;
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
  const deleteBtn = document.getElementById('delete-shift-btn');
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
  
  // Show/hide delete button based on mode
  if (mode === 'edit' && shiftId) {
    deleteBtn.style.display = 'inline-block';
    
    const shift = data.shifts.find(s => s.id === shiftId);
    
    if (shift) {
      document.getElementById('shift-id').value = shift.id;
      document.getElementById('shift-date').value = shift.date;
      document.getElementById('shift-start').value = shift.start;
      document.getElementById('shift-end').value = shift.end;
      document.getElementById('shift-employee').value = shift.employeeId;
    }
  } else if (mode === 'add' && date) {
    deleteBtn.style.display = 'none';
    document.getElementById('shift-date').value = date;
    document.getElementById('shift-id').value = '';
  }
  
  // Show modal
  modal.style.display = 'block';
  
  // IMPORTANT: Remove existing event listeners to prevent duplication
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);
  
  // Set up the delete shift button
  document.getElementById('delete-shift-btn').addEventListener('click', () => {
    const shiftId = parseInt(document.getElementById('shift-id').value);
    if (shiftId) {
      deleteShift(shiftId);
      modal.style.display = 'none';
    }
  });
  
  // Close modal when clicking on X
  document.querySelector('#shift-modal .close').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Form submit handler
  document.getElementById('shift-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = getData();
    const shiftId = document.getElementById('shift-id').value;
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

// Delete shift function
function deleteShift(id) {
  if (confirm('Are you sure you want to delete this shift?')) {
    const data = getData();
    
    // Remove shift
    data.shifts = data.shifts.filter(shift => shift.id !== id);
    
    // Save data and reload UI
    saveData(data);
    loadShiftsCalendar();
  }
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

  // --- DOM Elements (Consolidated) ---
  const sidebarLinks = document.querySelectorAll('#sidebar li');
  const pages = document.querySelectorAll('.page');
  const contactForm = document.getElementById('contact-form');
  const weeklyScheduleCalendar = document.getElementById('weekly-schedule-calendar');
  const alertsContent = document.getElementById('alerts-content');
  const shiftsCalendarContainer = document.getElementById('shifts-calendar');
  const shiftsMonthYearSpan = document.getElementById('shifts-month-year');
  const shiftModal = document.getElementById('shift-modal');
  const shiftModalTitle = document.getElementById('shift-modal-title');
  const shiftForm = document.getElementById('shift-form');
  const shiftIdInput = document.getElementById('shift-id');
  const shiftDateInput = document.getElementById('shift-date');
  const shiftEmployeeSelect = document.getElementById('shift-employee');
  const shiftStartTimeInput = document.getElementById('shift-start-time');
  const shiftEndTimeInput = document.getElementById('shift-end-time');
  const deleteShiftButton = document.getElementById('delete-shift-btn'); // Make sure this ID exists in HTML
  const closeShiftModalButton = shiftModal ? shiftModal.querySelector('.close') : null;

  // --- Utility Functions ---
  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }
  function getStartOfWeek(date) {
    const dt = new Date(date);
    const day = dt.getDay();
    const diff = dt.getDate() - day;
    return new Date(dt.setDate(diff));
  }

  // --- Page Switching Logic ---
  function showPage(pageId) {
    pages.forEach(page => page?.classList.remove('active'));
    sidebarLinks.forEach(link => link?.classList.remove('active'));

    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    } else {
        console.error(`Page with ID ${pageId}-page not found.`);
    }
    const targetLink = document.querySelector(`#sidebar li[data-page="${pageId}"]`);
     if (targetLink) {
        targetLink.classList.add('active');
    } else {
         console.error(`Sidebar link with data-page="${pageId}" not found.`);
     }

     // Re-render relevant pages when shown (optional but can ensure freshness)
     if (pageId === 'dashboard') {
         renderDashboard();
     } else if (pageId === 'shifts') {
         const today = new Date(); // Or use state for current month
         renderShiftsCalendar(today.getFullYear(), today.getMonth());
     } else if (pageId === 'employees') {
         loadEmployees(); // Assuming loadEmployees exists
     } else if (pageId === 'availability') {
         loadAvailability(); // Assuming loadAvailability exists
     }
  }

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        const pageId = link.getAttribute('data-page');
        if (pageId) {
            showPage(pageId);
        } else {
            console.error('Clicked sidebar link does not have a data-page attribute.');
        }
    });
  });

  // --- Contact Form Logic ---
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Contact form submitted. Backend integration needed.');
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const phone = document.getElementById('contact-phone').value;
        const message = document.getElementById('contact-message').value;
        console.log('Form Data:', { name, email, phone, message });
        alert('Message sent (simulation)!');
        contactForm.reset();
    });
  }

  // --- Rendering Functions (Dashboard, Weekly, Alerts, Monthly Calendar) ---
  function renderDashboard() {
    console.log("Rendering Dashboard...");
    const data = getData(); // Use getData()
    const allShifts = data.shifts || [];
    const allEmployees = data.employees || [];
    const today = new Date();
    renderWeeklySchedule(allShifts, allEmployees, today);
    renderAlerts(allShifts, today);
  }

  function renderWeeklySchedule(shifts, employees, date) {
    if (!weeklyScheduleCalendar) return;
    const existingCells = weeklyScheduleCalendar.querySelectorAll('div:not(:nth-child(-n+7))');
    existingCells.forEach(cell => cell.remove());
    const startOfWeek = getStartOfWeek(date);
    const employeeMap = new Map(employees.map(emp => [emp.id, emp.name]));
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        const formattedDate = formatDate(currentDay);
        const dayCell = document.createElement('div');
        dayCell.dataset.date = formattedDate;
        const shiftsForDay = shifts.filter(shift => shift.date === formattedDate);
        shiftsForDay.sort((a, b) => a.start.localeCompare(b.start));
        shiftsForDay.forEach(shift => {
            const shiftDiv = document.createElement('div');
            shiftDiv.classList.add('shift-entry');
            const employeeName = shift.employeeId ? employeeMap.get(shift.employeeId) || 'Unassigned' : 'Unassigned';
            shiftDiv.textContent = `${shift.start}: ${employeeName}`;
            dayCell.appendChild(shiftDiv);
        });
        if (shiftsForDay.length === 0) dayCell.innerHTML = '&nbsp;';
        weeklyScheduleCalendar.appendChild(dayCell);
    }
  }

  function renderAlerts(shifts, date) {
     if (!alertsContent) return;
     const todayStr = formatDate(date);
     const nextWeek = new Date(date);
     nextWeek.setDate(date.getDate() + 7);
     const nextWeekStr = formatDate(nextWeek);
     const upcomingUncoveredShifts = shifts.filter(shift =>
         shift.date >= todayStr && shift.date < nextWeekStr && !shift.employeeId
     );
     if (upcomingUncoveredShifts.length > 0) {
         alertsContent.textContent = `🚨 ${upcomingUncoveredShifts.length} uncovered shift(s) in the next 7 days!`;
         alertsContent.style.color = 'red';
     } else {
         const anyShiftsExist = shifts.some(shift => shift.date >= todayStr && shift.date < nextWeekStr);
         if (anyShiftsExist) {
             alertsContent.textContent = "✅ All upcoming shifts covered.";
             alertsContent.style.color = 'green';
         } else {
             alertsContent.textContent = "No upcoming shifts scheduled.";
             alertsContent.style.color = 'inherit';
         }
     }
  }

  function renderShiftsCalendar(year, month) {
    if (!shiftsCalendarContainer || !shiftsMonthYearSpan) return;
    shiftsCalendarContainer.innerHTML = '';
    const data = getData(); // Use getData()
    const shifts = data.shifts || [];
    const employees = data.employees || [];
    const employeeMap = new Map(employees.map(emp => [emp.id, emp.name]));
    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
    shiftsMonthYearSpan.textContent = `${monthName} ${year}`;
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => { /* Add headers */
        const headerCell = document.createElement('div');
        headerCell.classList.add('calendar-header');
        headerCell.textContent = day;
        shiftsCalendarContainer.appendChild(headerCell);
    });
    for (let i = 0; i < firstDayWeekday; i++) { /* Add empty cells */
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-day', 'empty');
        shiftsCalendarContainer.appendChild(emptyCell);
    }
    for (let day = 1; day <= totalDays; day++) { /* Add day cells */
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');
        const currentDate = new Date(year, month, day);
        const formattedDate = formatDate(currentDate);
        dayCell.dataset.date = formattedDate;
        const dayNumber = document.createElement('span');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);
        const shiftsContainer = document.createElement('div');
        shiftsContainer.classList.add('shifts-in-day');
        const shiftsForDay = shifts.filter(shift => shift.date === formattedDate);
        shiftsForDay.sort((a, b) => a.start.localeCompare(b.start));
        shiftsForDay.forEach(shift => { /* Add shift entries */
            const shiftDiv = document.createElement('div');
            shiftDiv.classList.add('shift-entry-monthly');
            const employeeName = shift.employeeId ? employeeMap.get(shift.employeeId) || 'Unassigned' : 'Unassigned';
            shiftDiv.textContent = `${shift.start}-${shift.end}: ${employeeName}`;
            shiftDiv.dataset.shiftId = shift.id;
            shiftDiv.addEventListener('click', (e) => { // EDIT LISTENER
                e.stopPropagation();
                const shiftId = e.currentTarget.dataset.shiftId;
                const date = e.currentTarget.closest('.calendar-day').dataset.date;
                openShiftModal(shiftId, date); // Calls the function below
            });
            shiftsContainer.appendChild(shiftDiv);
        });
        dayCell.appendChild(shiftsContainer);
        const addShiftBtn = document.createElement('button'); /* Add '+' button */
        addShiftBtn.classList.add('add-shift-day-btn');
        addShiftBtn.textContent = '+';
        addShiftBtn.title = `Add shift for ${formattedDate}`;
        addShiftBtn.addEventListener('click', (e) => { // ADD LISTENER
            e.stopPropagation();
            const date = e.currentTarget.closest('.calendar-day').dataset.date;
            openShiftModal(null, date); // Calls the function below
        });
        dayCell.appendChild(addShiftBtn);
        shiftsCalendarContainer.appendChild(dayCell);
    }
  }

  // --- Shift Modal Functions (Corrected and Integrated) ---
  function openShiftModal(shiftId = null, date) {
    if (!shiftModal || !shiftForm) return;
    shiftForm.reset();
    shiftDateInput.value = date;
    shiftIdInput.value = shiftId || '';

    const data = getData(); // Use getData()
    const employees = data.employees || [];
    shiftEmployeeSelect.innerHTML = '<option value="">-- Unassigned --</option>';
    employees.forEach(emp => {
      const option = document.createElement('option');
      option.value = emp.id; // ID is likely a number, value will be string
      option.textContent = emp.name;
      shiftEmployeeSelect.appendChild(option);
    });

    if (shiftId) {
      shiftModalTitle.textContent = 'Edit Shift';
      const shifts = data.shifts || []; // Use getData()
      const shift = shifts.find(s => String(s.id) === String(shiftId)); // Compare as strings just in case
      if (shift) {
        shiftEmployeeSelect.value = shift.employeeId || '';
        shiftStartTimeInput.value = shift.start;
        shiftEndTimeInput.value = shift.end;
        deleteShiftButton?.classList.remove('hidden');
      } else {
        console.error("Shift not found for editing:", shiftId);
        closeShiftModal();
        return;
      }
    } else {
      shiftModalTitle.textContent = 'Add Shift';
      deleteShiftButton?.classList.add('hidden');
    }
    shiftModal.style.display = 'block';
  }

  function closeShiftModal() {
    if (shiftModal) {
      shiftModal.style.display = 'none';
    }
  }

  function handleShiftFormSubmit(event) {
    event.preventDefault();
    const data = getData(); // Get current data
    const shifts = data.shifts || [];
    const shiftId = shiftIdInput.value;

    const employeeIdValue = shiftEmployeeSelect.value;
    const employeeId = employeeIdValue ? parseInt(employeeIdValue, 10) : null;

    const shiftData = {
      id: shiftId || `shift_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      date: shiftDateInput.value,
      employeeId: employeeId,
      start: shiftStartTimeInput.value,
      end: shiftEndTimeInput.value,
    };

    if (!shiftData.date || !shiftData.start || !shiftData.end) {
      alert("Please fill in date, start time, and end time.");
      return;
    }

    let updatedShifts;
    if (shiftId) {
      const index = shifts.findIndex(s => String(s.id) === String(shiftId));
      if (index > -1) {
        updatedShifts = [...shifts];
        updatedShifts[index] = shiftData;
      } else {
        console.error("Shift to update not found:", shiftId);
        updatedShifts = [...shifts, shiftData];
      }
    } else {
      updatedShifts = [...shifts, shiftData];
    }

    saveData({ ...data, shifts: updatedShifts });

    const [year, month] = shiftData.date.split('-').map(Number);
    renderShiftsCalendar(year, month - 1);
    renderDashboard();

    closeShiftModal();
  }

  function handleDeleteShift() {
    const shiftId = shiftIdInput.value;
    if (!shiftId) return;

    if (confirm('Are you sure you want to delete this shift?')) {
      const data = getData();
      let shifts = data.shifts || [];
      const initialLength = shifts.length;

      const updatedShifts = shifts.filter(s => String(s.id) !== String(shiftId));

      if (updatedShifts.length < initialLength) {
        saveData({ ...data, shifts: updatedShifts });

        const date = shiftDateInput.value;
        const [year, month] = date.split('-').map(Number);
        renderShiftsCalendar(year, month - 1);
        renderDashboard();
      } else {
        console.error("Shift to delete not found:", shiftId);
      }
      closeShiftModal();
    }
  }

  // --- Event Listeners for Shift Modal ---
  if (shiftForm) {
    shiftForm.addEventListener('submit', handleShiftFormSubmit);
  }
  if (deleteShiftButton) {
    deleteShiftButton.addEventListener('click', handleDeleteShift);
  }
  if (closeShiftModalButton) {
    closeShiftModalButton.addEventListener('click', closeShiftModal);
  }
  if (shiftModal) {
    shiftModal.addEventListener('click', (event) => {
      if (event.target === shiftModal) {
        closeShiftModal();
      }
    });
  }

  // --- Initial App Load ---
  function initializeApp() {
    renderDashboard();
    const today = new Date();
    renderShiftsCalendar(today.getFullYear(), today.getMonth());
    loadEmployees();
    loadAvailability();
    loadSettings();

    const initialPage = document.querySelector('#sidebar li.active')?.getAttribute('data-page') || 'dashboard';
    showPage(initialPage);
  }

  initializeApp();
});

window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal.id === 'login-modal' && !localStorage.getItem('isLoggedIn')) {
            return;
        }
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
