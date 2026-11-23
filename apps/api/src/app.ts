import express from 'express';
import { healthRouter } from './modules/health/http/health.routes.js';
import { authRouter } from './modules/auth/http/auth.routes.js';
import { organizationRouter } from './modules/organizations/http/organization.routes.js';
import { meRouter } from './modules/users/http/me.routes.js';

export const app = express();

app.use(express.json({ limit: '16kb' }));
app.use('/health', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/me', meRouter);
app.use('/api/v1/organizations', organizationRouter);

app.use((_request, response) => {
  response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Resource not found.' } });
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const candidate = error as { statusCode?: number; status?: number; code?: string; type?: string; message?: string };
  const status = candidate.statusCode ?? candidate.status ?? 500;
  const isInvalidJson = candidate.type === 'entity.parse.failed';
  response.status(status).json({
    error: {
      code: candidate.code ?? (isInvalidJson ? 'INVALID_JSON' : status === 413 ? 'PAYLOAD_TOO_LARGE' : 'INTERNAL_ERROR'),
      message: status >= 500 ? 'Internal server error.' : isInvalidJson ? 'Request body must contain valid JSON.' : status === 413 ? 'Request body is too large.' : candidate.message ?? 'Request failed.',
    },
  });
});
