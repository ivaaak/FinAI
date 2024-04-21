var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// index.ts
import * as dotenv from "dotenv";
import express4 from "express";

// src/routes/routes.ts
import express3 from "express";

// src/controllers/llamaService.ts
import express from "express";
import path from "path";
import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";
var llamaService = express.Router();
var models = {
  codellama: "codellama-13b.Q3_K_M.gguf"
};
var modelPath = path.join(process.cwd(), "models", models.codellama);
var model = new LlamaModel({
  modelPath
});
var context = new LlamaContext({ model });
var session = new LlamaChatSession({ context });
llamaService.post("/", (req, res) => __async(void 0, null, function* () {
  console.log("llamaService / POST /api/llm/ called");
  const userMessage = req.body.messages;
  console.log("User: " + userMessage);
  try {
    const aiResponse = yield session.prompt(userMessage);
    console.log("AI: " + aiResponse);
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}));
var llamaService_default = llamaService;

// src/controllers/employeeService.ts
import express2 from "express";

// src/data/database.ts
import * as mongodb from "mongodb";
var collections = {};
function connectToDatabase(uri) {
  return __async(this, null, function* () {
    const client = new mongodb.MongoClient(uri);
    yield client.connect();
    const db = client.db("finai");
    const employeesCollection = db.collection("employees");
    collections.employees = employeesCollection;
  });
}

// src/controllers/employeeService.ts
import { ObjectId } from "mongodb";
var employeeService = express2.Router();
employeeService.get("/", (req, res) => __async(void 0, null, function* () {
  var _a;
  console.log("employeesService / GET /api/employees/ called");
  try {
    const employees = yield (_a = collections.employees) == null ? void 0 : _a.find().toArray();
    if (employees) {
      res.json(employees);
    } else {
      res.status(404).send("No employees found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving employees");
  }
}));
employeeService.post("/", (req, res) => __async(void 0, null, function* () {
  var _a;
  console.log("employeesService / POST /api/employees/ called");
  const newEmployee = req.body;
  console.log("newEmployee", newEmployee);
  try {
    const result = yield (_a = collections.employees) == null ? void 0 : _a.insertOne(newEmployee);
    if (result) {
      res.status(201).json({ message: "Employee created successfully", employeeId: result.insertedId });
    } else {
      res.status(500).json({ message: "Error creating employee" });
    }
  } catch (error) {
    const err = error;
    res.status(500).json({ message: "Error creating employee", error: err.message });
  }
}));
employeeService.put("/:id", (req, res) => __async(void 0, null, function* () {
  var _a;
  console.log("employeesService / PUT /api/employees/:id called");
  try {
    const updatedEmployee = req.body;
    const id = new ObjectId(req.params.id);
    const result = yield (_a = collections.employees) == null ? void 0 : _a.updateOne({ _id: id }, { $set: updatedEmployee });
    if (result && result.modifiedCount > 0) {
      res.send(updatedEmployee);
    } else {
      res.status(404).send("Employee not found");
    }
  } catch (error) {
    const err = error;
    res.status(500).json({ message: "Error creating employee", error: err.message });
  }
}));
employeeService.delete("/:id", (req, res) => __async(void 0, null, function* () {
  var _a;
  console.log("employeesService / DELETE /api/employees/:id called");
  try {
    const id = new ObjectId(req.params.id);
    const result = yield (_a = collections.employees) == null ? void 0 : _a.deleteOne({ _id: id });
    if (result && result.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).send("Employee not found");
    }
  } catch (error) {
    res.status(500).send("Error deleting employee");
  }
}));
var employeeService_default = employeeService;

// src/routes/routes.ts
var router = express3.Router();
router.use("/llm", llamaService_default);
router.use("/employees", employeeService_default);
var routes_default = router;

// index.ts
import cors from "cors";
dotenv.config();
var { ATLAS_URI } = process.env;
if (!ATLAS_URI) {
  console.error(
    "No ATLAS_URI environment variable has been defined in config.env"
  );
  process.exit(1);
}
var app = express4();
var port = 9e3;
function startServer() {
  return __async(this, null, function* () {
    yield connectToDatabase(ATLAS_URI);
    app.use(cors());
    app.use(express4.json());
    app.use("/api", routes_default);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });
}
startServer().catch((error) => console.error(error));
