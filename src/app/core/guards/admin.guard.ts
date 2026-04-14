import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userJson = localStorage.getItem('bb_user');

  if (userJson) {
    const user = JSON.parse(userJson);
    if (user.role === 'admin') {
      return true;
    }
  }

  // Nếu chưa đăng nhập hoặc không phải admin thì đẩy về login
  router.navigate(['/login']);
  return false;
};
