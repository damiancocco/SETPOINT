import express from 'express';
import { healthRouter } from './modules/health/http/health.routes.js';

export const app = express();

app.use('/health', healthRouter);
