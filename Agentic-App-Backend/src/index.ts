import express from "express";
import cors from "cors";

// Create an instance of the Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
