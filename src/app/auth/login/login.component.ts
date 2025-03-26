import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private auth: AuthService, private router: Router) {}

  login(role: 'admin' | 'user') {
    this.auth.login(role);
    this.router.navigate([role === 'admin' ? '/forms' : '/form-list']);
  }
}
