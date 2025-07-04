import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiConstants } from '../../../core/constants/api.const';
import { ApiResponse } from '../../../core/interfaces/api-response.interface';
import { Invitation } from '../interfaces/invitation.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);

  getPendingInvitations(): Observable<Invitation[]> {
    return this.http
      .get<ApiResponse<Invitation[]>>(
        ApiConstants.ADMIN.GET_PENDING_INVITATIONS
      )
      .pipe(map((response) => response.payload || []));
  }

  inviteUser(email: string, roleName: string): Observable<void> {
    const payload = { email, roleName };
    return this.http.post<void>(ApiConstants.ADMIN.INVITE_USER, payload);
  }

  resendInvitation(id: number): Observable<void> {
    return this.http.post<void>(ApiConstants.ADMIN.RESEND_INVITATION(id), {});
  }

  cancelInvitation(id: number): Observable<void> {
    return this.http.delete<void>(ApiConstants.ADMIN.CANCEL_INVITATION(id));
  }
}
