import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const UserRoles = (...roles: UserRole[]) => SetMetadata('userRoles', roles);

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('userRoles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles specified, allow access (no restriction)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get user from request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user exists
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has role field
    if (!user.role) {
      throw new ForbiddenException('User role not found');
    }

    // Validate if user's role matches any of the required roles
    const hasRole = this.validateRoles(requiredRoles, user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}. Your role: ${user.role}`
      );
    }

    return true;
  }

  private validateRoles(requiredRoles: UserRole[], userRole: UserRole): boolean {
    return requiredRoles.includes(userRole); 
  }
}