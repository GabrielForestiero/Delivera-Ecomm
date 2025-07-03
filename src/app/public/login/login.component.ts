import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginRequest, User } from '../../services/auth/auth.service';
import { take } from 'rxjs/operators';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    FloatLabelModule,
    DividerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
  onSubmit(): void {
  if (this.loginForm.valid) {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const loginData: LoginRequest = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: () => {
        this.authService.user$.pipe(take(1)).subscribe((user: User | null) => {
          if (user?.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage =
          error.error?.message || 'Credenciales inválidas o error al iniciar sesión.';
      }
    });
  } else {
    this.loginForm.markAllAsTouched();
  }
}

}