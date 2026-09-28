// src/data/database.ts
import * as mongodb from 'mongodb';
import { Employee } from './entities/employee';

export const collections: {
  employees?: mongodb.Collection<Employee>;
} = {};

export const isDatabaseConnected = (): boolean => collections.employees !== undefined;

export async function connectToDatabase(uri: string): Promise<void> {
  const client = new mongodb.MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  await client.connect();

  const db = client.db('finai');
  collections.employees = db.collection<Employee>('employees');
}
