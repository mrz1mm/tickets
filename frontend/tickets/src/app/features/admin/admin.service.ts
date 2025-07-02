import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConstants } from '../../core/constants/api.const';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);

  inviteUser(email: string, roleName: string): Observable<void> {
    const payload = { email, roleName };
    return this.http.post<void>(ApiConstants.ADMIN.INVITE_USER, payload);
  }
}
