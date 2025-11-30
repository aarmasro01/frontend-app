import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

export const tabsHomeGuard: CanActivateFn = (): UrlTree => {
  const router = inject(Router);
  const rol = localStorage.getItem('rolUsuario');
  const rolNum = rol ? parseInt(rol, 10) : null;

  // Personal (rol != 1) => /tabs/panel; Cliente (1 o null) => /tabs/menu
  const target = rolNum && rolNum !== 1 ? '/tabs/panel' : '/tabs/menu';
  return router.parseUrl(target);
};
