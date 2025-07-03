import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth/auth.service';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessagesModule,
    MessageModule,
    ProgressSpinnerModule,
    FloatLabelModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const registerData: RegisterRequest = this.registerForm.value;

      this.authService.register(registerData).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Usuario registrado exitosamente';

          const userSub = this.authService.user$.subscribe(user => {
            if (user?.role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
            userSub.unsubscribe();
          });
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message ||
            (error.status === 400
              ? 'Datos inválidos. Verifica la información ingresada.'
              : error.status === 409
                ? 'El email ya está registrado.'
                : 'Error al registrar usuario. Intenta nuevamente.');
        }
      });

    } else {
      Object.values(this.registerForm.controls).forEach(control => control.markAsTouched());
    }
  }
}
