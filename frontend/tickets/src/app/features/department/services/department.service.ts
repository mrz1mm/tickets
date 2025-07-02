import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConstants } from '../../../core/constants/api.const';
import { ApiResponse } from '../../../core/interfaces/api-response.interface';
import { Department } from '../interfaces/department.interface';
import { DepartmentData } from '../interfaces/departmentData.interface';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private http = inject(HttpClient);

  /**
   * Recupera la lista di tutti i dipartimenti.
   * @returns Un Observable con l'array di Dipartimenti.
   */
  public getDepartments(): Observable<Department[]> {
    return this.http
      .get<ApiResponse<Department[]>>(ApiConstants.DEPARTMENTS.BASE)
      .pipe(map((response) => response.payload!));
  }

  /**
   * Crea un nuovo dipartimento.
   * @param departmentData I dati del nuovo dipartimento.
   * @returns Un Observable con il Dipartimento appena creato.
   */
  public createDepartment(
    departmentData: DepartmentData
  ): Observable<Department> {
    return this.http
      .post<ApiResponse<Department>>(
        ApiConstants.DEPARTMENTS.BASE,
        departmentData
      )
      .pipe(map((response) => response.payload!));
  }

  /**
   * Aggiorna un dipartimento esistente.
   * @param id L'ID del dipartimento da aggiornare.
   * @param departmentData I nuovi dati del dipartimento.
   * @returns Un Observable con il Dipartimento aggiornato.
   */
  public updateDepartment(
    id: number,
    departmentData: DepartmentData
  ): Observable<Department> {
    return this.http
      .put<ApiResponse<Department>>(
        ApiConstants.DEPARTMENTS.BY_ID(id),
        departmentData
      )
      .pipe(map((response) => response.payload!));
  }

  /**
   * Elimina un dipartimento.
   * @param id L'ID del dipartimento da eliminare.
   * @returns Un Observable<void> che si completa al successo.
   */
  public deleteDepartment(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(ApiConstants.DEPARTMENTS.BY_ID(id))
      .pipe(map(() => void 0));
  }
}
