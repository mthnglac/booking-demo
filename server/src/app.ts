import express, { Express } from "express";
import cors from "cors";
import photographerRoutes from "./routes";
import initialSeeder from "./db/seeds";
import { db } from "./db";

const app: Express = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(photographerRoutes);

db.on("error", console.error.bind(console, "MongoDB connection error:"));

(async (): Promise<void> => {
  await initialSeeder();
})();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export {
  app
}
