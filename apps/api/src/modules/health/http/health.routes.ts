import { Router } from 'express';
import { getHealthStatus } from '../application/get-health-status.js';

export const healthRouter = Router();

healthRouter.get('/', (_request, response) => {
  response.status(200).json(getHealthStatus());
});
