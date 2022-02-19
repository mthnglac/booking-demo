import express, { Express } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import photographerRoutes from "./routes";

const app: Express = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(photographerRoutes);

const uri: string = `mongodb://localhost:27017/${process.env.MONGO_DB}`;
const options = {
  useNewUrlParser: true,
} as ConnectOptions;

mongoose
  .connect(uri, options)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    throw error;
  });
