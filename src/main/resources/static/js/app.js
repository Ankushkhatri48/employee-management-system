// Endpoint Registry - mapping every Spring Boot controller endpoint
const endpoints = [
    {
        id: 'create-emp',
        title: 'Create Employee',
        method: 'POST',
        path: '/api/employees',
        description: 'Creates a new employee record and saves it to the MySQL database.',
        inputs: [
            { name: 'firstName', label: 'First Name', type: 'text', default: 'Aarav', required: true },
            { name: 'lastName', label: 'Last Name', type: 'text', default: 'Verma', required: true },
            { name: 'email', label: 'Email Address', type: 'email', default: 'aarav.verma@example.com', required: true },
            { name: 'department', label: 'Department', type: 'text', default: 'Engineering', required: true },
            { name: 'salary', label: 'Salary ($)', type: 'number', default: '92000', required: true }
        ],
        buildRequest: (data) => ({
            url: '/api/employees',
            options: {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    department: data.department,
                    salary: parseFloat(data.salary)
                })
            }
        })
    },
    {
        id: 'get-all',
        title: 'Get All Employees',
        method: 'GET',
        path: '/api/employees',
        description: 'Fetches the complete array of employee records.',
        inputs: [],
        buildRequest: () => ({
            url: '/api/employees',
            options: { method: 'GET' }
        })
    },
    {
        id: 'get-by-id',
        title: 'Get Employee By ID',
        method: 'GET',
        path: '/api/employees/{id}',
        description: 'Fetches an individual employee by their database primary key.',
        inputs: [
            { name: 'id', label: 'Employee ID', type: 'number', default: '1', required: true }
        ],
        buildRequest: (data) => ({
            url: `/api/employees/${data.id}`,
            options: { method: 'GET' }
        })
    },
    {
        id: 'update-emp',
        title: 'Update Employee',
        method: 'PUT',
        path: '/api/employees/{id}',
        description: 'Updates an existing employee details by ID.',
        inputs: [
            { name: 'id', label: 'Target Employee ID', type: 'number', default: '1', required: true },
            { name: 'firstName', label: 'First Name', type: 'text', default: 'Aarav', required: true },
            { name: 'lastName', label: 'Last Name', type: 'text', default: 'Verma', required: true },
            { name: 'email', label: 'Email Address', type: 'email', default: 'aarav.updated@example.com', required: true },
            { name: 'department', label: 'Department', type: 'text', default: 'Product & Tech', required: true },
            { name: 'salary', label: 'Updated Salary ($)', type: 'number', default: '105000', required: true }
        ],
        buildRequest: (data) => ({
            url: `/api/employees/${data.id}`,
            options: {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    department: data.department,
                    salary: parseFloat(data.salary)
                })
            }
        })
    },
    {
        id: 'get-by-dept',
        title: 'Get Employees By Department',
        method: 'GET',
        path: '/api/employees/department/{department}',
        description: 'Filters and retrieves all employees belonging to a specific department.',
        inputs: [
            { name: 'department', label: 'Department Name', type: 'text', default: 'Engineering', required: true }
        ],
        buildRequest: (data) => ({
            url: `/api/employees/department/${encodeURIComponent(data.department)}`,
            options: { method: 'GET' }
        })
    },
    {
        id: 'get-salary',
        title: 'Get Salary Breakdown',
        method: 'GET',
        path: '/api/employees/{id}/salary',
        description: 'Calculates and retrieves annual & monthly compensation info for an employee.',
        inputs: [
            { name: 'id', label: 'Employee ID', type: 'number', default: '1', required: true }
        ],
        buildRequest: (data) => ({
            url: `/api/employees/${data.id}/salary`,
            options: { method: 'GET' }
        })
    },
    {
        id: 'delete-emp',
        title: 'Delete Employee',
        method: 'DELETE',
        path: '/api/employees/{id}',
        description: 'Permanently deletes an employee record by their ID.',
        inputs: [
            { name: 'id', label: 'Employee ID to Delete', type: 'number', default: '1', required: true }
        ],
        buildRequest: (data) => ({
            url: `/api/employees/${data.id}`,
            options: { method: 'DELETE' }
        })
    }
];

let currentIndex = 0;

// DOM Elements
const tabBar = document.getElementById('endpoint-tab-bar');
const epMethod = document.getElementById('ep-method');
const epPath = document.getElementById('ep-path');
const epTitle = document.getElementById('ep-title');
const epDesc = document.getElementById('ep-desc');
const dynamicInputs = document.getElementById('dynamic-inputs');
const endpointForm = document.getElementById('endpoint-form');
const responseOutput = document.getElementById('response-output');
const respStatus = document.getElementById('resp-status');
const respTime = document.getElementById('resp-time');

// Nav buttons
const prevBtn = document.getElementById('prev-endpoint-btn');
const nextBtn = document.getElementById('next-endpoint-btn');
const bottomPrevBtn = document.getElementById('bottom-prev-btn');
const bottomNextBtn = document.getElementById('bottom-next-btn');
const bottomPrevLabel = document.getElementById('bottom-prev-label');
const bottomNextLabel = document.getElementById('bottom-next-label');
const stepCounter = document.getElementById('step-counter');

document.addEventListener('DOMContentLoaded', () => {
    renderTabs();
    loadEndpoint(0);

    // Nav listeners
    prevBtn.addEventListener('click', goToPrev);
    bottomPrevBtn.addEventListener('click', goToPrev);
    nextBtn.addEventListener('click', goToNext);
    bottomNextBtn.addEventListener('click', goToNext);

    // Form submission
    endpointForm.addEventListener('submit', executeCurrentEndpoint);
});

function renderTabs() {
    tabBar.innerHTML = endpoints.map((ep, idx) => `
        <button class="ep-tab ${idx === 0 ? 'active' : ''}" onclick="loadEndpoint(${idx})" id="tab-${idx}">
            <span class="tab-badge http-badge ${ep.method}">${ep.method}</span>
            <span>${ep.title}</span>
        </button>
    `).join('');
}

function loadEndpoint(index) {
    currentIndex = index;
    const ep = endpoints[currentIndex];

    // Update active tab styling
    document.querySelectorAll('.ep-tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === currentIndex);
    });

    // Header info
    epMethod.textContent = ep.method;
    epMethod.className = `http-badge ${ep.method}`;
    epPath.textContent = ep.path;
    epTitle.textContent = ep.title;
    epDesc.textContent = ep.description;

    // Counter
    stepCounter.textContent = `Endpoint ${currentIndex + 1} of ${endpoints.length}`;

    // Nav button state
    prevBtn.disabled = currentIndex === 0;
    bottomPrevBtn.disabled = currentIndex === 0;
    bottomPrevLabel.textContent = currentIndex > 0 ? `Prev: ${endpoints[currentIndex - 1].title}` : 'Previous';

    const isLast = currentIndex === endpoints.length - 1;
    bottomNextLabel.textContent = isLast ? 'Finish (Loop to Start)' : `Next: ${endpoints[currentIndex + 1].title}`;

    // Clear response box
    responseOutput.textContent = `// Ready. Click "Send Request" to test ${ep.method} ${ep.path}`;
    respStatus.textContent = 'Status: Idle';
    respStatus.className = 'status-chip chip-neutral';
    respTime.textContent = 'Time: -';

    // Render Inputs
    renderInputs(ep.inputs);
}

function renderInputs(inputs) {
    if (!inputs || inputs.length === 0) {
        dynamicInputs.innerHTML = `
            <div class="empty-params-note">
                No request body or URL parameters required for this endpoint.
            </div>
        `;
        return;
    }

    dynamicInputs.innerHTML = inputs.map(input => `
        <div class="input-field">
            <label for="inp-${input.name}">${input.label} ${input.required ? '*' : ''}</label>
            <input 
                type="${input.type}" 
                id="inp-${input.name}" 
                name="${input.name}" 
                value="${input.default || ''}" 
                ${input.required ? 'required' : ''}
            >
        </div>
    `).join('');
}

async function executeCurrentEndpoint(e) {
    e.preventDefault();
    const ep = endpoints[currentIndex];

    // Extract form data
    const formData = new FormData(endpointForm);
    const data = Object.fromEntries(formData.entries());

    const { url, options } = ep.buildRequest(data);

    responseOutput.textContent = 'Sending request to server...';
    respStatus.textContent = 'Status: Sending...';
    respStatus.className = 'status-chip chip-neutral';

    const startTime = performance.now();

    try {
        const response = await fetch(url, options);
        const duration = Math.round(performance.now() - startTime);
        respTime.textContent = `${duration} ms`;

        respStatus.textContent = `Status: ${response.status} ${response.statusText}`;
        respStatus.className = response.ok ? 'status-chip chip-success' : 'status-chip chip-error';

        const contentType = response.headers.get('content-type');
        let body;
        if (contentType && contentType.includes('application/json')) {
            body = await response.json();
            responseOutput.textContent = JSON.stringify(body, null, 2);
        } else {
            body = await response.text();
            responseOutput.textContent = body || '// Empty response body returned with HTTP ' + response.status;
        }
    } catch (err) {
        const duration = Math.round(performance.now() - startTime);
        respTime.textContent = `${duration} ms`;
        respStatus.textContent = 'Status: Network Error';
        respStatus.className = 'status-chip chip-error';
        responseOutput.textContent = `Error: ${err.message}\nCheck your internet connection or backend server status.`;
    }
}

function goToPrev() {
    if (currentIndex > 0) {
        loadEndpoint(currentIndex - 1);
    }
}

function goToNext() {
    if (currentIndex < endpoints.length - 1) {
        loadEndpoint(currentIndex + 1);
    } else {
        // Loop back to start
        loadEndpoint(0);
    }
}
