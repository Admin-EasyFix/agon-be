import express from 'express';
import swaggerUi from "swagger-ui-express";
import cors from 'cors';
import { setRoutes } from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import { openApiSpec } from './config/openapi';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(openApiSpec));

setRoutes(app);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});