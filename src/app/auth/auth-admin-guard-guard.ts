import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './authService';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  console.log("authAdminGuard:" + authService.isRoleAdmin());
  return authService.isRoleAdmin();
};
