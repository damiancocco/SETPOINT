import { Prisma } from '../../../generated/prisma/client.js';
import { prisma } from '../../../infrastructure/database/prisma.js';
import { hashPassword, verifyPassword } from '../domain/password.js';
import { createSessionToken, hashSessionToken, SESSION_ABSOLUTE_MS } from '../domain/session-token.js';

const genericCredentialsError = Object.assign(new Error('Invalid email or password.'), { statusCode: 401, code: 'INVALID_CREDENTIALS' });
const DUMMY_PASSWORD_HASH = 'scrypt$v1$131072$8$1$JBC8rcon1Onz_oSWeG4Mgw$fZSS0ecjxsrmJpvanqwtgZClZN37GsGG30LIgHBVK0i4iEm_yDH8kfvEjMMq0b-EgRb2-eJ0AQ3vS_QhV-CmWg';

export class AuthService {
  async register(email: string, password: string): Promise<void> {
    try {
      await prisma.user.create({ data: { email: email.trim().toLowerCase(), passwordHash: await hashPassword(password), status: 'ACTIVE' } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return;
      throw error;
    }
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    const passwordValid = await verifyPassword(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);
    if (!user?.passwordHash || user.status !== 'ACTIVE' || !passwordValid) throw genericCredentialsError;
    const token = createSessionToken();
    const now = new Date();
    await prisma.authSession.create({ data: { userId: user.id, tokenHash: hashSessionToken(token), lastSeenAt: now, expiresAt: new Date(now.getTime() + SESSION_ABSOLUTE_MS) } });
    return { token, user: safeUser(user) };
  }

  async logout(userId: string, tokenHash: string) {
    await prisma.authSession.updateMany({ where: { userId, tokenHash, revokedAt: null }, data: { revokedAt: new Date() } });
  }
}

export function safeUser(user: { id: string; email: string; status: string; emailVerifiedAt: Date | null; createdAt: Date }) {
  return { id: user.id, email: user.email, status: user.status, emailVerifiedAt: user.emailVerifiedAt, createdAt: user.createdAt };
}
