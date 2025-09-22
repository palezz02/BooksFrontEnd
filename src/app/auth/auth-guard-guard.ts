import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './authService';
import { Router } from 'express';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  console.log("authGuard :" + authService.isAutentificated());
  if(!authService.isAutentificated()){
    console.log('no logged')
    router.navigate(['/login']);
  }
  return authService.isAutentificated();
};
