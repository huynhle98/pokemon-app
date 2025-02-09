import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService } from '../../services/auth.service';
import { NzIconModule, provideNzIconsPatch } from 'ng-zorro-antd/icon';
import {
  HomeOutline,
  LockOutline,
  UnorderedListOutline,
  UserOutline,
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
  ],
  providers: [provideNzIconsPatch([UserOutline, LockOutline])],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form!: FormGroup;
  isLoginMode = true; // Toggle between Login & Signup
  loading = false;

  constructor() {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group(
      {
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(3)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordsMatchValidator,
      }
    );

    this.form.get('password')?.valueChanges.subscribe((value) => {
      if (!this.isLoginMode) return;

      this.form.get('confirmPassword')?.setValue(value);
    });
  }

  private passwordsMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsNotMatching: true };
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.form.reset();
  }

  submitForm() {
    if (this.form.invalid) return;
    this.loading = true;

    const { username, password } = this.form.value;
    const authObservable = this.isLoginMode
      ? this.authService.login(username, password)
      : this.authService.signup(username, password);

    authObservable.subscribe({
      next: (res) => {
        this.authService.setToken(res.access_token);
        this.router.navigate(['/']); // Redirect to home after login
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
