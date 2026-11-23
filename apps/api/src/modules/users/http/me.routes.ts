import { Router } from 'express';
import { prisma } from '../../../infrastructure/database/prisma.js';
import { safeUser } from '../../auth/application/auth.service.js';
import { requireAuth } from '../../auth/http/auth.middleware.js';

export const meRouter = Router();
meRouter.get('/', requireAuth, async (request, response, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: request.auth!.userId }, include: { memberships: { where: { status: 'ACTIVE' }, include: { organization: true }, orderBy: { createdAt: 'asc' } } } });
    if (!user) { response.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Account not found.' } }); return; }
    response.json({ data: { user: safeUser(user), organizations: user.memberships.map(({ organization, role, status }) => ({ ...organization, role, membershipStatus: status })) } });
  } catch (error) { next(error); }
});
