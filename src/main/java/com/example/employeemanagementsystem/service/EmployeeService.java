package com.example.employeemanagementsystem.service;

import com.example.employeemanagementsystem.entity.Employee;

import java.util.List;
import java.util.Map;

public interface EmployeeService {

    Employee createEmployee(Employee employee);

    List<Employee> getAllEmployees();

    Employee getEmployeeById(Long id);

    Employee updateEmployee(Long id, Employee employeeDetails);

    void deleteEmployee(Long id);

    List<Employee> getEmployeesByDepartment(String department);

    Map<String, Object> getEmployeeSalary(Long id);
}
