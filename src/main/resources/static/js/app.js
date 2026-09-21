// API Base URL
const API_BASE = '/api/employees';

// State
let allEmployees = [];
let currentFilter = 'ALL';
let currentSearch = '';

// DOM Elements
const tbody = document.getElementById('employee-tbody');
const statTotal = document.getElementById('stat-total');
const statDepts = document.getElementById('stat-depts');
const statPayroll = document.getElementById('stat-payroll');
const statAvgSalary = document.getElementById('stat-avg-salary');
const deptFilter = document.getElementById('department-filter');
const searchInput = document.getElementById('search-input');
const refreshBtn = document.getElementById('refresh-btn');
const showingCount = document.getElementById('showing-count');
const toastEl = document.getElementById('toast');

// Modal Elements
const empModal = document.getElementById('employee-modal');
const modalTitle = document.getElementById('modal-title');
const empForm = document.getElementById('employee-form');
const empIdInput = document.getElementById('emp-id');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const emailInput = document.getElementById('email');
const departmentInput = document.getElementById('department');
const salaryInput = document.getElementById('salary');
const openAddModalBtn = document.getElementById('open-add-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelModalBtn = document.getElementById('cancel-modal-btn');

// View & Salary Modal
const viewModal = document.getElementById('view-modal');
const closeViewBtn = document.getElementById('close-view-btn');
const dismissViewBtn = document.getElementById('dismiss-view-btn');
const viewDetailsContent = document.getElementById('view-details-content');

const salaryModal = document.getElementById('salary-modal');
const closeSalaryBtn = document.getElementById('close-salary-btn');
const dismissSalaryBtn = document.getElementById('dismiss-salary-btn');
const salaryDetailsContent = document.getElementById('salary-details-content');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadEmployees();
    setupEventListeners();
});

function setupEventListeners() {
    // Refresh
    refreshBtn.addEventListener('click', loadEmployees);

    // Search filter
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        applyFiltersAndRender();
    });

    // Department Filter (Uses GET /api/employees/department/{name} or full list)
    deptFilter.addEventListener('change', async (e) => {
        currentFilter = e.target.value;
        if (currentFilter === 'ALL') {
            await loadEmployees();
        } else {
            await loadEmployeesByDepartment(currentFilter);
        }
    });

    // Add modal triggers
    openAddModalBtn.addEventListener('click', () => openEmployeeModal());
    closeModalBtn.addEventListener('click', closeEmployeeModal);
    cancelModalBtn.addEventListener('click', closeEmployeeModal);

    // Save Form (POST /api/employees or PUT /api/employees/{id})
    empForm.addEventListener('submit', handleFormSubmit);

    // Close view & salary modals
    closeViewBtn.addEventListener('click', () => viewModal.classList.add('hidden'));
    dismissViewBtn.addEventListener('click', () => viewModal.classList.add('hidden'));
    closeSalaryBtn.addEventListener('click', () => salaryModal.classList.add('hidden'));
    dismissSalaryBtn.addEventListener('click', () => salaryModal.classList.add('hidden'));
}

// 1. GET /api/employees - Fetch All
async function loadEmployees() {
    renderLoading();
    try {
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error('Failed to fetch employees');
        allEmployees = await response.json();
        updateDepartmentDropdown(allEmployees);
        updateKPIs(allEmployees);
        applyFiltersAndRender();
    } catch (err) {
        console.error(err);
        showToast('Error connecting to API: ' + err.message, 'error');
        renderError('Could not load employees. Make sure your backend and DB are running.');
    }
}

// 2. GET /api/employees/department/{department} - Filter by Department
async function loadEmployeesByDepartment(department) {
    renderLoading();
    try {
        const encodedDept = encodeURIComponent(department);
        const response = await fetch(`${API_BASE}/department/${encodedDept}`);
        if (!response.ok) throw new Error(`Failed to load department: ${department}`);
        const deptEmployees = await response.json();
        allEmployees = deptEmployees;
        updateKPIs(allEmployees);
        applyFiltersAndRender();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// 3. GET /api/employees/{id} - View single employee
async function viewEmployee(id) {
    viewDetailsContent.innerHTML = `<div class="spinner"></div>`;
    viewModal.classList.remove('hidden');
    try {
        const response = await fetch(`${API_BASE}/${id}`);
        if (!response.ok) throw new Error('Employee not found');
        const emp = await response.json();
        
        viewDetailsContent.innerHTML = `
            <div class="detail-list">
                <div class="breakdown-row">
                    <span class="breakdown-label">Employee ID</span>
                    <span class="breakdown-value">#${emp.id}</span>
                </div>
                <div class="breakdown-row">
                    <span class="breakdown-label">Full Name</span>
                    <span class="breakdown-value">${emp.firstName} ${emp.lastName}</span>
                </div>
                <div class="breakdown-row">
                    <span class="breakdown-label">Email</span>
                    <span class="breakdown-value">${emp.email}</span>
                </div>
                <div class="breakdown-row">
                    <span class="breakdown-label">Department</span>
                    <span class="dept-pill">${emp.department}</span>
                </div>
                <div class="breakdown-row">
                    <span class="breakdown-label">Annual Salary</span>
                    <span class="breakdown-value highlight">$${Number(emp.salary).toLocaleString()}</span>
                </div>
            </div>
        `;
    } catch (err) {
        viewDetailsContent.innerHTML = `<p style="color: var(--danger)">${err.message}</p>`;
    }
}

// 4. GET /api/employees/{id}/salary - View Salary Details
async function viewSalaryDetails(id) {
    salaryDetailsContent.innerHTML = `<div class="spinner"></div>`;
    salaryModal.classList.remove('hidden');
    try {
        const response = await fetch(`${API_BASE}/${id}/salary`);
        if (!response.ok) throw new Error('Salary details unavailable');
        const data = await response.json();

        salaryDetailsContent.innerHTML = `
            <div class="salary-breakdown-card">
                <div class="breakdown-row">
                    <span class="breakdown-label">Employee</span>
                    <span class="breakdown-value">${data.employeeName || 'ID: ' + id}</span>
                </div>
                <div class="breakdown-row">
                    <span class="breakdown-label">Annual Salary</span>
                    <span class="breakdown-value highlight">$${Number(data.annualSalary || data.salary || 0).toLocaleString()}</span>
                </div>
                <div class="breakdown-row">
                    <span class="breakdown-label">Monthly Gross</span>
                    <span class="breakdown-value">$${Number((data.monthlySalary || (data.annualSalary / 12) || 0)).toFixed(2)}</span>
                </div>
                <div class="breakdown-row">
                    <span class="breakdown-label">Department</span>
                    <span class="dept-pill">${data.department || 'N/A'}</span>
                </div>
            </div>
        `;
    } catch (err) {
        salaryDetailsContent.innerHTML = `<p style="color: var(--danger)">${err.message}</p>`;
    }
}

// 5. POST & PUT /api/employees - Create or Update
async function handleFormSubmit(e) {
    e.preventDefault();
    const id = empIdInput.value;
    const isEdit = Boolean(id);

    const payload = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        department: departmentInput.value.trim(),
        salary: parseFloat(salaryInput.value)
    };

    const url = isEdit ? `${API_BASE}/${id}` : API_BASE;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            const msg = errData.message || (errData.errors ? Object.values(errData.errors).join(', ') : 'Action failed');
            throw new Error(msg);
        }

        closeEmployeeModal();
        showToast(isEdit ? 'Employee updated successfully!' : 'Employee created successfully!', 'success');
        await loadEmployees();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// 6. DELETE /api/employees/{id} - Remove employee
async function deleteEmployee(id, name) {
    if (!confirm(`Are you sure you want to delete ${name} (ID: ${id})?`)) return;

    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Could not delete employee');
        const data = await response.json();
        showToast(data.message || 'Employee removed successfully', 'success');
        await loadEmployees();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// Modal open/close helpers
function openEmployeeModal(emp = null) {
    empForm.reset();
    if (emp) {
        modalTitle.textContent = 'Edit Employee';
        empIdInput.value = emp.id;
        firstNameInput.value = emp.firstName;
        lastNameInput.value = emp.lastName;
        emailInput.value = emp.email;
        departmentInput.value = emp.department;
        salaryInput.value = emp.salary;
    } else {
        modalTitle.textContent = 'Add New Employee';
        empIdInput.value = '';
    }
    empModal.classList.remove('hidden');
}

function closeEmployeeModal() {
    empModal.classList.add('hidden');
}

// Render Functions
function applyFiltersAndRender() {
    let list = allEmployees;

    if (currentSearch) {
        list = list.filter(e => 
            `${e.firstName} ${e.lastName}`.toLowerCase().includes(currentSearch) ||
            e.email.toLowerCase().includes(currentSearch) ||
            e.department.toLowerCase().includes(currentSearch)
        );
    }

    renderTable(list);
}

function renderTable(employees) {
    showingCount.textContent = `Showing ${employees.length} employee${employees.length === 1 ? '' : 's'}`;

    if (!employees || employees.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-cell">
                    <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 6px;">No employees found</p>
                    <p style="color: var(--text-dim); font-size: 0.85rem;">Click "Add Employee" above to create your first record.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = employees.map(emp => {
        const initials = `${emp.firstName?.charAt(0) || ''}${emp.lastName?.charAt(0) || ''}`;
        return `
            <tr>
                <td style="color: var(--text-dim); font-weight: 600;">#${emp.id}</td>
                <td>
                    <div class="emp-name-badge">
                        <div class="emp-avatar">${initials}</div>
                        <span class="emp-fullname">${escapeHtml(emp.firstName)} ${escapeHtml(emp.lastName)}</span>
                    </div>
                </td>
                <td style="color: var(--text-muted);">${escapeHtml(emp.email)}</td>
                <td><span class="dept-pill">${escapeHtml(emp.department)}</span></td>
                <td><span class="salary-val">$${Number(emp.salary).toLocaleString()}</span></td>
                <td class="text-right">
                    <div class="actions-cell">
                        <button class="btn-icon view-btn" title="View Details (GET)" onclick="viewEmployee(${emp.id})">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                        <button class="btn-icon salary-btn" title="Salary Breakdown (GET /salary)" onclick="viewSalaryDetails(${emp.id})">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                        </button>
                        <button class="btn-icon edit-btn" title="Edit Employee (PUT)" onclick='openEmployeeModal(${JSON.stringify(emp)})'>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn-icon del-btn" title="Delete Employee (DELETE)" onclick="deleteEmployee(${emp.id}, '${escapeHtml(emp.firstName)} ${escapeHtml(emp.lastName)}')">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function updateKPIs(employees) {
    const total = employees.length;
    statTotal.textContent = total;

    const depts = new Set(employees.map(e => e.department).filter(Boolean));
    statDepts.textContent = depts.size;

    const totalSalary = employees.reduce((sum, e) => sum + (Number(e.salary) || 0), 0);
    statPayroll.textContent = '$' + totalSalary.toLocaleString();

    const avgSalary = total > 0 ? Math.round(totalSalary / total) : 0;
    statAvgSalary.textContent = '$' + avgSalary.toLocaleString();
}

function updateDepartmentDropdown(employees) {
    const currentVal = deptFilter.value;
    const depts = Array.from(new Set(employees.map(e => e.department).filter(Boolean))).sort();
    
    deptFilter.innerHTML = `<option value="ALL">All Departments</option>` +
        depts.map(d => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');

    if (depts.includes(currentVal)) {
        deptFilter.value = currentVal;
    }
}

function renderLoading() {
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="loading-cell">
                <div class="spinner"></div>
                <p>Loading employees from database...</p>
            </td>
        </tr>
    `;
}

function renderError(msg) {
    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="loading-cell" style="color: var(--danger);">
                <p style="font-weight: 600;">Connection Error</p>
                <p style="font-size: 0.85rem; color: var(--text-dim); margin-top: 4px;">${escapeHtml(msg)}</p>
            </td>
        </tr>
    `;
}

function showToast(message, type = 'success') {
    toastEl.textContent = message;
    toastEl.className = `toast toast-${type}`;
    setTimeout(() => {
        toastEl.className = 'toast hidden';
    }, 4000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
