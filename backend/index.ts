import * as dotenv from "dotenv";
import express from "express";
import routes from "./src/routes/routes";
import cors from "cors";
import { connectToDatabase } from "./src/data/database";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();
const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
  console.error(
    "No ATLAS_URI environment variable has been defined in config.env"
  );
  process.exit(1);
}

const app = express();
const port = 9000;


async function startServer() {
  await connectToDatabase(ATLAS_URI!); // Connect to the database
  // Use the routes module
  app.use(cors());
  app.use(express.json()); // For parsing application/json
  app.use('/api', routes); // Prefix all routes with '/api'

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch((error) => console.error(error));