import * as mongodb from "mongodb";
import { Employee } from "./models/employee";

export const collections: {
    employees?: mongodb.Collection<Employee>;
} = {};


export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("finai");

    const employeesCollection = db.collection<Employee>("employees");
    collections.employees = employeesCollection;
}

