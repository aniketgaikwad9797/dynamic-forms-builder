import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentRole = new BehaviorSubject<'admin' | 'user' | null>(null);
  currentRole$ = this.currentRole.asObservable();

  get currentRoleValue() {
    return this.currentRole.value;
  }

  login(role: 'admin' | 'user') {
    this.currentRole.next(role);
  }

  logout() {
    this.currentRole.next(null);
  }

  get isAdmin() {
    return this.currentRole.value === 'admin';
  }
}
