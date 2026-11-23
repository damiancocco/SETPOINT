import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { AuthService } from '../application/auth.service.js';
import { requireAuth } from './auth.middleware.js';

export const authRouter = Router();
const service = new AuthService();
const credentials = z.object({ email: z.string().trim().email().max(254), password: z.string().min(15).max(128) }).strict();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });

authRouter.post('/register', authLimiter, async (request, response, next) => {
  const parsed = credentials.safeParse(request.body);
  if (!parsed.success) { response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid registration data.', details: parsed.error.flatten().fieldErrors } }); return; }
  try {
    await service.register(parsed.data.email, parsed.data.password);
    response.status(200).json({ data: { message: 'If you are new to SETPOINT, you can now sign in. If you already have an account, sign in with it.' } });
  }
  catch (error) { next(error); }
});

authRouter.post('/login', authLimiter, async (request, response, next) => {
  const parsed = credentials.safeParse(request.body);
  if (!parsed.success) { response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid login data.', details: parsed.error.flatten().fieldErrors } }); return; }
  try { response.json({ data: await service.login(parsed.data.email, parsed.data.password) }); }
  catch (error) { next(error); }
});

authRouter.post('/logout', requireAuth, async (request, response, next) => {
  try { await service.logout(request.auth!.userId, request.auth!.tokenHash); response.status(204).end(); }
  catch (error) { next(error); }
});
