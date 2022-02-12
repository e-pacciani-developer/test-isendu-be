import express, { Application, NextFunction, Request, Response } from 'express';
import { buildRoutes } from './router';
import cors from 'cors';

export const app: Application = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.listen(PORT, () => console.log('Example app listening on port ' + PORT));

// ---------------------- MIDDLEWARES ------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  return res.status(err.status).send({ message: err.message });
});

// ---------------------- ROUTES ------------------------
buildRoutes(app);
