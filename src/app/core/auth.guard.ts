import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    const currentRole = this.auth.currentRoleValue; // Use the synchronous getter
    if (!currentRole) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
