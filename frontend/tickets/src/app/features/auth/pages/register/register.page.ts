import { RegisterRequest } from '../../interfaces/register-request.interface';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { AuthService } from '../../services/auth.service';
import { Path } from '../../../../core/constants/path.constants.const';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './register.page.html',
  styleUrl: '../login/login.page.scss',
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authSvc = inject(AuthService);
  private router = inject(Router);

  public Path = Path;
  public isLoading = signal(false);

  public registerForm = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  public onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    const registerData = this.registerForm.getRawValue() as RegisterRequest;

    this.authSvc
      .register(registerData)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((success) => {
        if (success) {
          this.router.navigate(['/auth/login']);
        }
      });
  }
}
