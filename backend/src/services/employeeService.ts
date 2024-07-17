// src/services/EmployeeService.ts

import { collections } from '../data/database';
import { ObjectId } from 'mongodb';
import { Employee } from '../data/entities/employee';

export class EmployeeService {
  async getAllEmployees(): Promise<Employee[]> {
    const employees = await collections.employees?.find().toArray();
    if (!employees) {
      throw new Error('No employees found');
    }
    return employees;
  }

  async createEmployee(newEmployee: Employee): Promise<ObjectId> {
    const result = await collections.employees?.insertOne(newEmployee);
    if (!result) {
      throw new Error('Error creating employee');
    }
    return result.insertedId;
  }

  async updateEmployee(id: string, updatedEmployee: Partial<Employee>): Promise<void> {
    const result = await collections.employees?.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedEmployee }
    );
    if (!result || result.modifiedCount === 0) {
      throw new Error('Employee not found');
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    const result = await collections.employees?.deleteOne({ _id: new ObjectId(id) });
    if (!result || result.deletedCount === 0) {
      throw new Error('Employee not found');
    }
  }
}