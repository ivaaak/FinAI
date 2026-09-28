// src/controllers/employeeController.ts
import { NextFunction, Request, Response } from 'express';
import { Employee } from '../data/entities/employee';
import { EmployeeService } from '../services/employeeService';

class EmployeeController {
  private employeeService = new EmployeeService();

  async getAllEmployees(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json(await this.employeeService.getAllEmployees());
    } catch (error) {
      next(error);
    }
  }

  async createEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = await this.employeeService.createEmployee(req.body as Employee);
      res.status(201).json({ message: 'Employee created successfully', employeeId });
    } catch (error) {
      next(error);
    }
  }

  async updateEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.employeeService.updateEmployee(req.params.id, req.body);
      res.json(req.body);
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.employeeService.deleteEmployee(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new EmployeeController();
