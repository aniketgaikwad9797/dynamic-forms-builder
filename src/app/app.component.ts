import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  switchRole() {
    const currentRole = this.authService.currentRoleValue;
    const newRole = currentRole === 'admin' ? 'user' : 'admin';

    this.authService.login(newRole);
    this.router.navigate([
      newRole === 'admin' ? '/forms/builder' : '/forms/list',
    ]);

    this.snackBar.open(`Switched to ${newRole} mode`, 'Close', {
      duration: 2000,
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 2000,
    });
  }
}
