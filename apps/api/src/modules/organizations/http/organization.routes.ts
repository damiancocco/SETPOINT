import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../../auth/http/auth.middleware.js';
import { OrganizationService } from '../application/organization.service.js';

export const organizationRouter = Router();
const service = new OrganizationService();
const organizationInput = z.object({ name: z.string().trim().min(2).max(120), slug: z.string().trim().min(3).max(63).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) }).strict();

organizationRouter.post('/', requireAuth, async (request, response, next) => {
  const parsed = organizationInput.safeParse(request.body);
  if (!parsed.success) { response.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid organization data.', details: parsed.error.flatten().fieldErrors } }); return; }
  try { response.status(201).json({ data: { organization: await service.create(request.auth!.userId, parsed.data.name, parsed.data.slug) } }); }
  catch (error) { next(error); }
});
