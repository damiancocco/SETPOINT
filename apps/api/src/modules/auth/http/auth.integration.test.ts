import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createHash, randomUUID } from 'node:crypto';
import { after, test } from 'node:test';
import type { AddressInfo } from 'node:net';
import { app } from '../../../app.js';
import { prisma } from '../../../infrastructure/database/prisma.js';
import { OrganizationService } from '../../organizations/application/organization.service.js';
import { hashPassword, verifyPassword } from '../domain/password.js';
import { SESSION_IDLE_MS } from '../domain/session-token.js';

const server = app.listen(0);
await once(server, 'listening');
const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
const fixtureUserIds: string[] = [];
const fixtureSlugs: string[] = [];

after(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  for (const slug of fixtureSlugs) {
    const organization = await prisma.organization.findUnique({ where: { slug } });
    if (organization) {
      await prisma.organizationMembership.deleteMany({ where: { organizationId: organization.id } });
      await prisma.organization.delete({ where: { id: organization.id } });
    }
  }
  if (fixtureUserIds.length) {
    await prisma.authSession.deleteMany({ where: { userId: { in: fixtureUserIds } } });
    await prisma.user.deleteMany({ where: { id: { in: fixtureUserIds } } });
  }
  await prisma.$disconnect();
});

test('registration, login, protected profile, organization ownership and transaction rollback', async () => {
  const suffix = randomUUID();
  const email = `setpoint-test-${suffix}@example.com`;
  const password = 'Secure SETPOINT passphrase 2026!';
  const slug = `test-${suffix}`;
  fixtureSlugs.push(slug);

  const registeredResponse = await fetch(`${baseUrl}/api/v1/auth/register`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: ` ${email.toUpperCase()} `, password }) });
  assert.equal(registeredResponse.status, 200);
  const registeredBody = await registeredResponse.json() as { data: { message: string; user?: unknown } };
  assert.equal('user' in registeredBody.data, false);
  const persisted = await prisma.user.findUniqueOrThrow({ where: { email } });
  fixtureUserIds.push(persisted.id);
  assert.match(persisted.passwordHash ?? '', /^scrypt\$v1\$/);
  assert.notEqual(persisted.passwordHash, password);

  const duplicateResponse = await fetch(`${baseUrl}/api/v1/auth/register`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });
  assert.equal(duplicateResponse.status, 200);
  assert.deepEqual(await duplicateResponse.json(), registeredBody);

  const wrongPasswordResponse = await fetch(`${baseUrl}/api/v1/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password: 'Wrong password phrase 2026!' }) });
  assert.equal(wrongPasswordResponse.status, 401);
  const nonexistentResponse = await fetch(`${baseUrl}/api/v1/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: `missing-${suffix}@example.com`, password }) });
  assert.equal(nonexistentResponse.status, 401);
  assert.deepEqual(await nonexistentResponse.json(), await wrongPasswordResponse.json());

  const noAuthResponse = await fetch(`${baseUrl}/api/v1/me`);
  assert.equal(noAuthResponse.status, 401);

  const loginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });
  assert.equal(loginResponse.status, 200);
  const login = await loginResponse.json() as { data: { token: string; user: { id: string } } };
  const session = await prisma.authSession.findUniqueOrThrow({ where: { tokenHash: createHash('sha256').update(login.data.token).digest('hex') } });
  assert.notEqual(session.tokenHash, login.data.token);
  assert.equal(session.expiresAt.getTime() - session.createdAt.getTime() <= 12 * 60 * 60 * 1000 + 1000, true);

  const profileResponse = await fetch(`${baseUrl}/api/v1/me`, { headers: { authorization: `Bearer ${login.data.token}` } });
  assert.equal(profileResponse.status, 200);
  const profile = await profileResponse.json() as { data: { user: { id: string }; organizations: unknown[] } };
  assert.equal(profile.data.user.id, persisted.id);
  assert.deepEqual(profile.data.organizations, []);

  const invalidPasswordResponse = await fetch(`${baseUrl}/api/v1/auth/register`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: `short-${suffix}@example.com`, password: 'too-short' }) });
  assert.equal(invalidPasswordResponse.status, 400);

  const orgResponse = await fetch(`${baseUrl}/api/v1/organizations`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${login.data.token}` }, body: JSON.stringify({ name: 'Test Organization', slug }) });
  assert.equal(orgResponse.status, 201);
  const organization = await orgResponse.json() as { data: { organization: { id: string; membership: { role: string } } } };
  assert.equal(organization.data.organization.membership.role, 'owner');

  await prisma.authSession.update({ where: { id: session.id }, data: { lastSeenAt: new Date(Date.now() - SESSION_IDLE_MS - 1000) } });
  const idleExpiredResponse = await fetch(`${baseUrl}/api/v1/me`, { headers: { authorization: `Bearer ${login.data.token}` } });
  assert.equal(idleExpiredResponse.status, 401);

  const absoluteLoginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });
  assert.equal(absoluteLoginResponse.status, 200);
  const absoluteLogin = await absoluteLoginResponse.json() as { data: { token: string } };
  const absoluteHash = createHash('sha256').update(absoluteLogin.data.token).digest('hex');
  const absoluteSession = await prisma.authSession.findUniqueOrThrow({ where: { tokenHash: absoluteHash } });
  await prisma.authSession.update({ where: { id: absoluteSession.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
  const absoluteExpiredResponse = await fetch(`${baseUrl}/api/v1/me`, { headers: { authorization: `Bearer ${absoluteLogin.data.token}` } });
  assert.equal(absoluteExpiredResponse.status, 401);

  const concurrentLoginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });
  const concurrentLogin = await concurrentLoginResponse.json() as { data: { token: string } };
  const concurrentRequests = Array.from({ length: 6 }, () => fetch(`${baseUrl}/api/v1/me`, { headers: { authorization: `Bearer ${concurrentLogin.data.token}` } }));
  const concurrentLogout = fetch(`${baseUrl}/api/v1/auth/logout`, { method: 'POST', headers: { authorization: `Bearer ${concurrentLogin.data.token}` } });
  const concurrentResponses = await Promise.all([...concurrentRequests, concurrentLogout]);
  assert.equal(concurrentResponses.at(-1)?.status, 204);
  assert.ok(concurrentResponses.slice(0, -1).every((response) => [200, 401].includes(response.status)));
  const afterLogoutResponse = await fetch(`${baseUrl}/api/v1/me`, { headers: { authorization: `Bearer ${concurrentLogin.data.token}` } });
  assert.equal(afterLogoutResponse.status, 401);

  const rollbackSlug = `rollback-${suffix}`;
  fixtureSlugs.push(rollbackSlug);
  await assert.rejects(() => new OrganizationService().create(randomUUID(), 'Must roll back', rollbackSlug));
  assert.equal(await prisma.organization.count({ where: { slug: rollbackSlug } }), 0);

});

test('scrypt hashes accept the current and legacy format and reject malformed parameters or lengths', async () => {
  const password = 'Test password with enough length 2026!';
  const versioned = await hashPassword(password);
  assert.equal(await verifyPassword(password, versioned), true);
  const legacy = versioned.replace('scrypt$v1$', 'scrypt$');
  assert.equal(await verifyPassword(password, legacy), true);

  const parts = versioned.split('$');
  const malformed = [
    '',
    `${versioned}$extra`,
    versioned.replace('$v1$', '$v2$'),
    versioned.replace('$131072$', '$999999999999999999999$'),
    versioned.replace('$8$', '$0$'),
    versioned.replace('$1$', '$2$'),
    versioned.replace(parts[5]!, '$AA'),
    versioned.replace(parts[6]!, '$AA'),
  ];
  for (const hash of malformed) assert.equal(await verifyPassword(password, hash), false);
});

test('rate limiter blocks further registration and login attempts from one client key', async () => {
  const responses = await Promise.all(Array.from({ length: 15 }, () => fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}',
  })));
  assert.ok(responses.some((response) => response.status === 429));
});
