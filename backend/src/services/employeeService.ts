// src/services/employeeService.ts

import { collections } from '../data/database';
import { ObjectId } from 'mongodb';
import { Employee } from '../data/entities/employee';
import { HttpError } from '../utils/httpError';

const toObjectId = (id: string): ObjectId => {
  if (!ObjectId.isValid(id)) {
    throw new HttpError(400, 'Invalid employee id');
  }
  return new ObjectId(id);
};

export class EmployeeService {
  private get employees() {
    if (!collections.employees) {
      throw new HttpError(503, 'Database is not connected');
    }
    return collections.employees;
  }

  async getAllEmployees(): Promise<Employee[]> {
    return this.employees.find().toArray();
  }

  async createEmployee(newEmployee: Employee): Promise<ObjectId> {
    // Never trust a client-supplied _id
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...employee } = newEmployee;
    const result = await this.employees.insertOne(employee);
    return result.insertedId;
  }

  async updateEmployee(id: string, updatedEmployee: Partial<Employee>): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...changes } = updatedEmployee;
    const result = await this.employees.updateOne({ _id: toObjectId(id) }, { $set: changes });
    if (result.matchedCount === 0) {
      throw new HttpError(404, 'Employee not found');
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    const result = await this.employees.deleteOne({ _id: toObjectId(id) });
    if (result.deletedCount === 0) {
      throw new HttpError(404, 'Employee not found');
    }
  }
}
