import { HttpInterceptorFn } from '@angular/common/http';
import { EMPTY } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  let token: string | null = null;
  if (isBrowser) {
    token = window.localStorage.getItem('token');
  }
  // Don't add token for login or register
  if (req.url.endsWith('/rest/user/signin') || req.url.endsWith('/rest/user/create')) {
    return next(req);
  }
  if (token && typeof token === 'string' && token !== 'null' && token !== '') {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(req);
  }
  return EMPTY;
};
