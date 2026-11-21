import type { HealthStatus } from '../domain/health-status.js';

export function getHealthStatus(): HealthStatus {
  return { status: 'ok' };
}
