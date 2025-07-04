import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConstants } from '../../../core/constants/api.const';
import { ApiResponse } from '../../../core/interfaces/api-response.interface';
import { Pageable } from '../../../core/interfaces/pageable.interface';
import { PagedResult } from '../../../core/interfaces/paged-result.interface';
import { UserDetail } from '../../auth/interfaces/user-detail.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getCompanyUsers(pageable: Pageable): Observable<PagedResult<UserDetail>> {
    const params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    return this.http
      .get<ApiResponse<PagedResult<UserDetail>>>(ApiConstants.ADMIN.GET_USERS, {
        params,
      })
      .pipe(map((response) => response.payload!));
  }
}
