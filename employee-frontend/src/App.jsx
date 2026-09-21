import React, { useState, useEffect } from 'react';
import { api, API_BASE_URL } from './api';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Server,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ENDPOINTS = [
  {
    id: 'create-emp',
    title: 'Create Employee',
    method: 'POST',
    path: '/api/employees',
    description: 'Creates a new employee record and persists it to the MySQL database.',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', default: 'Aarav', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', default: 'Verma', required: true },
      { name: 'email', label: 'Email Address', type: 'email', default: 'aarav.verma@example.com', required: true },
      { name: 'department', label: 'Department', type: 'text', default: 'Engineering', required: true },
      { name: 'salary', label: 'Annual Salary ($)', type: 'number', default: '95000', required: true }
    ],
    execute: async (form) => {
      return api.createEmployee({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        department: form.department,
        salary: parseFloat(form.salary)
      });
    }
  },
  {
    id: 'get-all',
    title: 'Get All Employees',
    method: 'GET',
    path: '/api/employees',
    description: 'Retrieves all employees currently registered in the database.',
    fields: [],
    execute: async () => api.getAllEmployees()
  },
  {
    id: 'get-by-id',
    title: 'Get Employee By ID',
    method: 'GET',
    path: '/api/employees/{id}',
    description: 'Fetches detailed information for an employee by primary key ID.',
    fields: [
      { name: 'id', label: 'Employee ID', type: 'number', default: '1', required: true }
    ],
    execute: async (form) => api.getEmployeeById(form.id)
  },
  {
    id: 'update-emp',
    title: 'Update Employee',
    method: 'PUT',
    path: '/api/employees/{id}',
    description: 'Updates details of an existing employee by their ID.',
    fields: [
      { name: 'id', label: 'Target Employee ID', type: 'number', default: '1', required: true },
      { name: 'firstName', label: 'First Name', type: 'text', default: 'Aarav', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', default: 'Verma', required: true },
      { name: 'email', label: 'Email Address', type: 'email', default: 'aarav.updated@example.com', required: true },
      { name: 'department', label: 'Department', type: 'text', default: 'Product & Tech', required: true },
      { name: 'salary', label: 'Updated Salary ($)', type: 'number', default: '110000', required: true }
    ],
    execute: async (form) => {
      return api.updateEmployee(form.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        department: form.department,
        salary: parseFloat(form.salary)
      });
    }
  },
  {
    id: 'get-dept',
    title: 'Filter By Department',
    method: 'GET',
    path: '/api/employees/department/{department}',
    description: 'Returns all employees who belong to the specified department.',
    fields: [
      { name: 'department', label: 'Department Name', type: 'text', default: 'Engineering', required: true }
    ],
    execute: async (form) => api.getByDepartment(form.department)
  },
  {
    id: 'get-salary',
    title: 'Salary & Compensation Breakdown',
    method: 'GET',
    path: '/api/employees/{id}/salary',
    description: 'Calculates and returns annual and monthly salary breakdown for an employee.',
    fields: [
      { name: 'id', label: 'Employee ID', type: 'number', default: '1', required: true }
    ],
    execute: async (form) => api.getEmployeeSalary(form.id)
  },
  {
    id: 'delete-emp',
    title: 'Delete Employee',
    method: 'DELETE',
    path: '/api/employees/{id}',
    description: 'Removes an employee record from the database by ID.',
    fields: [
      { name: 'id', label: 'Employee ID to Delete', type: 'number', default: '1', required: true }
    ],
    execute: async (form) => api.deleteEmployee(form.id)
  }
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [responseOutput, setResponseOutput] = useState('// Click "Send Request" to test this endpoint...');
  const [respStatus, setRespStatus] = useState({ text: 'Status: Idle', type: 'neutral' });
  const [respTime, setRespTime] = useState('-');
  const [loading, setLoading] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState(null);

  const currentEndpoint = ENDPOINTS[currentIndex];

  // Initialize form defaults when active endpoint changes
  useEffect(() => {
    const initial = {};
    currentEndpoint.fields.forEach((f) => {
      initial[f.name] = f.default || '';
    });
    setFormData(initial);
    setResponseOutput(`// Ready. Click "Send Request" to invoke ${currentEndpoint.method} ${currentEndpoint.path}`);
    setRespStatus({ text: 'Status: Idle', type: 'neutral' });
    setRespTime('-');
  }, [currentIndex]);

  // Check live API health on mount
  useEffect(() => {
    api.checkHealth()
      .then(() => setBackendHealthy(true))
      .catch(() => setBackendHealthy(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExecute = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRespStatus({ text: 'Sending...', type: 'neutral' });
    const start = performance.now();

    try {
      const result = await currentEndpoint.execute(formData);
      const elapsed = Math.round(performance.now() - start);
      setRespTime(`${elapsed} ms`);
      setRespStatus({ text: '200 OK', type: 'success' });
      setResponseOutput(JSON.stringify(result, null, 2));
      setBackendHealthy(true);
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      setRespTime(`${elapsed} ms`);
      setRespStatus({ text: 'Error', type: 'error' });
      setResponseOutput(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const goNext = () => {
    if (currentIndex < ENDPOINTS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  return (
    <div className="app-wrapper">
      {/* Top Navbar */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon">
            <Server size={22} />
          </div>
          <div>
            <h1 className="brand-title">Employee Management System</h1>
            <p className="brand-subtitle">React + Spring Boot Cloud Connected Interface</p>
          </div>
        </div>

        <div className="header-status">
          <div className={`health-badge ${backendHealthy === true ? 'connected' : backendHealthy === false ? 'error' : ''}`}>
            <span className="pulse-dot"></span>
            {backendHealthy === true && 'Database Connected (Render)'}
            {backendHealthy === false && 'Backend Offline / Connecting'}
            {backendHealthy === null && 'Connecting to Backend...'}
          </div>
        </div>
      </header>

      {/* Horizontal Tabs */}
      <nav className="tabs-scroll-container">
        {ENDPOINTS.map((ep, idx) => (
          <button
            key={ep.id}
            onClick={() => setCurrentIndex(idx)}
            className={`endpoint-tab-btn ${currentIndex === idx ? 'active' : ''}`}
          >
            <span className={`badge-method ${ep.method}`}>{ep.method}</span>
            <span>{ep.title}</span>
          </button>
        ))}
      </nav>

      {/* Main Interactive Stage */}
      <main className="stage-card">
        <div className="stage-header">
          <div className="route-info">
            <div className="route-meta">
              <span className={`badge-method ${currentEndpoint.method}`}>
                {currentEndpoint.method}
              </span>
              <span className="route-path">{currentEndpoint.path}</span>
            </div>
            <h2 className="route-title">{currentEndpoint.title}</h2>
            <p className="route-desc">{currentEndpoint.description}</p>
          </div>

          {/* Stepper Navigation */}
          <div className="nav-actions">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="btn-nav"
              title="Previous endpoint"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <span className="nav-counter">
              Endpoint {currentIndex + 1} of {ENDPOINTS.length}
            </span>

            <button
              onClick={goNext}
              className="btn-nav primary"
              title="Next endpoint"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* 2-Column Playground Grid */}
        <div className="stage-grid">
          {/* Request Form */}
          <div className="panel-container">
            <div className="panel-top">
              <h4>Request Parameters & Data</h4>
            </div>

            <form onSubmit={handleExecute} className="panel-content">
              {currentEndpoint.fields.length === 0 ? (
                <div className="empty-inputs-notice">
                  No request body or URL parameters required. Click "Send Request" to execute directly.
                </div>
              ) : (
                currentEndpoint.fields.map((f) => (
                  <div key={f.name} className="form-field">
                    <label htmlFor={`field-${f.name}`}>
                      {f.label} {f.required && '*'}
                    </label>
                    <input
                      id={`field-${f.name}`}
                      name={f.name}
                      type={f.type}
                      required={f.required}
                      value={formData[f.name] ?? ''}
                      onChange={handleInputChange}
                    />
                  </div>
                ))
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-execute"
              >
                <Play size={16} fill="white" />
                {loading ? 'Executing...' : 'Send Request'}
              </button>
            </form>
          </div>

          {/* Live Response Panel */}
          <div className="panel-container">
            <div className="panel-top">
              <h4>Live Backend & MySQL Response</h4>
              <div className="response-meta">
                <span className={`meta-tag ${respStatus.type}`}>
                  {respStatus.text}
                </span>
                <span className="meta-tag neutral">
                  {respTime}
                </span>
              </div>
            </div>

            <div className="code-viewer">
              <pre>{responseOutput}</pre>
            </div>
          </div>
        </div>

        {/* Bottom Quick-Action Stepper */}
        <div className="bottom-stepper">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="btn-nav"
          >
            <ChevronLeft size={16} />
            {currentIndex > 0
              ? `Prev: ${ENDPOINTS[currentIndex - 1].title}`
              : 'Previous'}
          </button>

          <button
            onClick={goNext}
            className="btn-nav primary"
          >
            {currentIndex < ENDPOINTS.length - 1
              ? `Next: ${ENDPOINTS[currentIndex + 1].title}`
              : 'Finish (Loop to Start)'}
            <ChevronRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
