import express from 'express';
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import cors from 'cors';
import { setRoutes } from './routes/index';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 4000;
const openApiPath = path.join(__dirname, "../openapi.yaml");
const openApiSpec = YAML.parse(fs.readFileSync(openApiPath, "utf8"));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(openApiSpec));

setRoutes(app);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});