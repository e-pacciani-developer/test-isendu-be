import express, { Application, NextFunction, Request, Response } from 'express';
import { buildRoutes } from './router';
import cors from 'cors';

export const app: Application = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.listen(PORT);

// ---------------------- MIDDLEWARES ------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---------------------- ROUTES ------------------------
buildRoutes(app);
