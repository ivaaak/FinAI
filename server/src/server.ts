import * as dotenv from "dotenv";
import express from "express";
import routes from "./services/routes";
import cors from "cors";
import { connectToDatabase } from "./database";
//import { migrateFloorplanData } from './database'; // Import the migration function

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();
const { ATLAS_URI } = process.env;
const app = express();
const port = 3000;

if (!ATLAS_URI) {
  console.error(
    "No ATLAS_URI environment variable has been defined in config.env"
  );
  process.exit(1);
}


async function startServer() {
  await connectToDatabase(ATLAS_URI!); // Connect to the database
  // await migrateFloorplanData(); // Migrate floorplan data

  // Use the routes module
  app.use(cors());
  app.use(express.json()); // For parsing application/json
  app.use('/api', routes); // Prefix all routes with '/api'

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch((error) => console.error(error));