import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { ApiConstants } from '../../../core/constants/api.const';
import { ApiResponse } from '../../../core/interfaces/api-response.interface';
import { Department } from '../interfaces/department.interface';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private http = inject(HttpClient);

  /**
   * Recupera la lista di tutti i dipartimenti disponibili.
   * Utile per i menu a tendina nei form di creazione/modifica ticket.
   * @returns Un Observable che emette un array di Dipartimenti, o null in caso di errore.
   */
  public getAll(): Observable<Department[] | null> {
    return this.http
      .get<ApiResponse<Department[]>>(ApiConstants.DEPARTMENTS.BASE_URL)
      .pipe(
        map((response) => response.payload),
        catchError(() => of(null))
      );
  }
}
