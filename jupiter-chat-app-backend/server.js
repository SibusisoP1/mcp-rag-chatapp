import express from "express";
import cors from "cors";
import chatRouter from "./src/chatRouter.js";

// Automatically load .env variables
try {
  process.loadEnvFile();
} catch {
  // If .env file does not exist, system environment variables are used
}

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so the React frontend can call this backend
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// A simple entry route (Health check)
app.get("/", (req, res) => {
  res.send("Chat app backend is running!");
});

app.use("/api", chatRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is happily running on Port:${PORT}`);
});
