import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../../../infrastructure/database/prisma.js';
import { hashSessionToken, SESSION_IDLE_MS } from '../domain/session-token.js';

declare global { namespace Express { interface Request { auth?: { userId: string; tokenHash: string } } } }

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
  const [scheme, token, ...extra] = (request.header('authorization') ?? '').split(' ');
  if (scheme !== 'Bearer' || !token || extra.length) {
    response.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Authentication required.' } }); return;
  }
  const tokenHash = hashSessionToken(token);
  const session = await prisma.authSession.findUnique({ where: { tokenHash }, include: { user: true } });
  const now = new Date();
  if (!session || session.revokedAt || session.user.status !== 'ACTIVE' || session.expiresAt <= now || session.lastSeenAt.getTime() + SESSION_IDLE_MS <= now.getTime()) {
    response.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Session is invalid or expired.' } }); return;
  }
  const refreshed = await prisma.authSession.updateMany({
    where: {
      id: session.id,
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: now },
      lastSeenAt: { gt: new Date(now.getTime() - SESSION_IDLE_MS) },
    },
    data: { lastSeenAt: now },
  });
  if (refreshed.count !== 1) {
    response.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Session is invalid or expired.' } }); return;
  }
  request.auth = { userId: session.userId, tokenHash };
  next();
}
