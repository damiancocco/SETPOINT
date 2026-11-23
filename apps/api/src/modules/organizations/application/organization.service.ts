import { Prisma } from '../../../generated/prisma/client.js';
import { prisma } from '../../../infrastructure/database/prisma.js';

export class OrganizationService {
  async create(userId: string, name: string, slug: string) {
    try {
      return await prisma.$transaction(async (tx) => {
        const organization = await tx.organization.create({ data: { name: name.trim(), slug: slug.trim().toLowerCase() } });
        const membership = await tx.organizationMembership.create({ data: { organizationId: organization.id, userId, role: 'owner', status: 'ACTIVE' }, select: { id: true, role: true, status: true, createdAt: true } });
        return { ...organization, membership };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw Object.assign(new Error('An organization with this slug already exists.'), { statusCode: 409, code: 'ORGANIZATION_SLUG_ALREADY_EXISTS' });
      throw error;
    }
  }
}
