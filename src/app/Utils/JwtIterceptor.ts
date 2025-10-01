import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  try {
    // Check if window and localStorage exist (means browser)
    const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    let token: string | null = null;
    if (isBrowser) {
      token = window.localStorage.getItem('token');
    }
    if (token && typeof token === 'string' && token !== 'null' && token !== '') {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next(req);
  } catch (err) {
    return next(req);
  }
};
