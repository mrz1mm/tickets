import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, catchError, of } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../interfaces/register-request.interface';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './register.page.html',
  styleUrl: '../login/login.page.scss',
})
export class RegisterPage implements OnInit {
  private fb = inject(FormBuilder);
  private authSvc = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public isLoading = signal(false);
  public validationState = signal<'validating' | 'valid' | 'invalid'>(
    'validating'
  );
  public validationError = signal<string>(
    'Validazione del link di invito in corso...'
  );

  public registerForm = this.fb.group({
    token: ['', Validators.required],
    displayName: ['', [Validators.required, Validators.minLength(3)]],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
    ],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.validationState.set('invalid');
      this.validationError.set('Token di invito mancante o non valido.');
      return;
    }

    this.registerForm.patchValue({ token });

    this.authSvc
      .validateInvitationToken(token)
      .pipe(
        catchError((err) => {
          this.validationState.set('invalid');
          this.validationError.set(
            err.error.message || 'Invito non valido o scaduto.'
          );
          return of(null);
        })
      )
      .subscribe((email) => {
        if (email) {
          this.registerForm.patchValue({ email });
          this.validationState.set('valid');
        }
      });
  }

  public onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.isLoading.set(true);

    const formValue = this.registerForm.getRawValue();
    const registerData: RegisterRequest = {
      token: formValue.token!,
      displayName: formValue.displayName!,
      password: formValue.password!,
    };

    this.authSvc
      .register(registerData)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((success) => {
        if (success) {
          this.router.navigate(['/auth/login'], {
            queryParams: { registration: 'success' },
          });
        }
      });
  }
}
