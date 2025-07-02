import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { AdminService } from '../../services/admin.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './user-management.page.html',
})
export class UserManagementPage {
  private fb = inject(FormBuilder);
  private adminSvc = inject(AdminService);

  public isLoading = signal(false);

  public inviteForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    roleName: ['ROLE_USER', Validators.required],
  });

  public onInviteSubmit(): void {
    if (this.inviteForm.invalid) return;
    this.isLoading.set(true);

    const { email, roleName } = this.inviteForm.getRawValue();

    this.adminSvc
      .inviteUser(email!, roleName!)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(() => {
        this.inviteForm.reset({ roleName: 'ROLE_USER' });
      });
  }
}
