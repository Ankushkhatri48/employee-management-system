// Base URL for the Spring Boot REST API
// Connects directly to the live Render cloud deployment (or your local backend if running)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://employee-management-system-d96h.onrender.com';

const EMPLOYEES_URL = `${API_BASE_URL}/api/employees`;

export const api = {
    // 1. GET /api/employees - Retrieve all employees
    getAllEmployees: async () => {
        const res = await fetch(EMPLOYEES_URL);
        if (!res.ok) throw new Error(`Failed to fetch employees (${res.status})`);
        return res.json();
    },

    // 2. GET /api/employees/{id} - Get employee by ID
    getEmployeeById: async (id) => {
        const res = await fetch(`${EMPLOYEES_URL}/${id}`);
        if (!res.ok) throw new Error(`Employee #${id} not found (${res.status})`);
        return res.json();
    },

    // 3. POST /api/employees - Create new employee
    createEmployee: async (employeeData) => {
        const res = await fetch(EMPLOYEES_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `Failed to create employee (${res.status})`);
        }
        return res.json();
    },

    // 4. PUT /api/employees/{id} - Update employee details
    updateEmployee: async (id, employeeData) => {
        const res = await fetch(`${EMPLOYEES_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `Failed to update employee #${id} (${res.status})`);
        }
        return res.json();
    },

    // 5. DELETE /api/employees/{id} - Delete employee
    deleteEmployee: async (id) => {
        const res = await fetch(`${EMPLOYEES_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error(`Failed to delete employee #${id} (${res.status})`);
        return res.json();
    },

    // 6. GET /api/employees/department/{department} - Filter by department
    getByDepartment: async (dept) => {
        const res = await fetch(`${EMPLOYEES_URL}/department/${encodeURIComponent(dept)}`);
        if (!res.ok) throw new Error(`Failed to fetch employees in ${dept} (${res.status})`);
        return res.json();
    },

    // 7. GET /api/employees/{id}/salary - Get salary compensation breakdown
    getEmployeeSalary: async (id) => {
        const res = await fetch(`${EMPLOYEES_URL}/${id}/salary`);
        if (!res.ok) throw new Error(`Salary details for employee #${id} not found (${res.status})`);
        return res.json();
    },

    // 8. GET /api/health - Health check
    checkHealth: async () => {
        const res = await fetch(`${API_BASE_URL}/api/health`);
        if (!res.ok) throw new Error(`API health check failed (${res.status})`);
        return res.json();
    }
};
