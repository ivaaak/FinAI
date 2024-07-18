// src/controllers/EmployeeController.ts

import { Request, Response } from 'express';
import { EmployeeService } from '../services/employeeService';
import { Employee } from '../data/entities/employee';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  async getAllEmployees(req: Request, res: Response): Promise<void> {
    console.log("GET /api/employees/ called");
    try {
      const employees = await this.employeeService.getAllEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).send('Error retrieving employees');
    }
  }

  async createEmployee(req: Request, res: Response): Promise<void> {
    console.log("POST /api/employees/ called");
    const newEmployee: Employee = req.body;
    try {
      const employeeId = await this.employeeService.createEmployee(newEmployee);
      res.status(201).json({ message: "Employee created successfully", employeeId });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error creating employee", error: err.message });
    }
  }

  async updateEmployee(req: Request, res: Response): Promise<void> {
    console.log("PUT /api/employees/:id called");
    try {
      const updatedEmployee = req.body;
      const id = req.params.id;
      await this.employeeService.updateEmployee(id, updatedEmployee);
      res.send(updatedEmployee);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: "Error updating employee", error: err.message });
    }
  }

  async deleteEmployee(req: Request, res: Response): Promise<void> {
    console.log("DELETE /api/employees/:id called");
    try {
      const id = req.params.id;
      await this.employeeService.deleteEmployee(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).send('Error deleting employee');
    }
  }
}