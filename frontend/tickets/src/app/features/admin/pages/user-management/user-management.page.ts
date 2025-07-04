import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { AdminService } from '../../services/admin.service';
import { finalize } from 'rxjs';
import { Invitation } from '../../interfaces/invitation.interface';

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule, DatePipe],
  templateUrl: './user-management.page.html',
})
export class UserManagementPage implements OnInit {
  private fb = inject(FormBuilder);
  private adminSvc = inject(AdminService);

  public isInviting = signal(false);
  public isLoadingInvites = signal(true);
  public pendingInvites = signal<Invitation[]>([]);

  public inviteForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    roleName: ['ROLE_USER', Validators.required],
  });

  ngOnInit(): void {
    this.loadPendingInvites();
  }

  loadPendingInvites(): void {
    this.isLoadingInvites.set(true);
    this.adminSvc
      .getPendingInvitations()
      .pipe(finalize(() => this.isLoadingInvites.set(false)))
      .subscribe((invites) => {
        this.pendingInvites.set(invites);
      });
  }

  onInviteSubmit(): void {
    if (this.inviteForm.invalid) return;
    this.isInviting.set(true);

    const { email, roleName } = this.inviteForm.getRawValue();

    this.adminSvc
      .inviteUser(email!, roleName!)
      .pipe(finalize(() => this.isInviting.set(false)))
      .subscribe(() => {
        this.inviteForm.reset({ email: '', roleName: 'ROLE_USER' });
        this.loadPendingInvites();
      });
  }

  onResend(invitationId: number): void {
    // Potremmo aggiungere uno stato di loading per la singola riga
    this.adminSvc.resendInvitation(invitationId).subscribe(() => {
      this.loadPendingInvites();
    });
  }

  onCancel(invitation: Invitation): void {
    if (
      confirm(`Sei sicuro di voler annullare l'invito per ${invitation.email}?`)
    ) {
      this.adminSvc.cancelInvitation(invitation.id).subscribe(() => {
        this.loadPendingInvites();
      });
    }
  }
}
