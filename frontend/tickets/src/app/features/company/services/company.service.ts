import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Company } from '../interfaces/company.interface';
import { ApiConstants } from '../../../core/constants/api.const';
import { ApiResponse } from '../../../core/interfaces/api-response.interface';
import { CompanyData } from '../interfaces/company-data.interface';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private http = inject(HttpClient);

  getCompanies(): Observable<Company[]> {
    return this.http
      .get<ApiResponse<Company[]>>(ApiConstants.COMPANIES.BASE)
      .pipe(map((response) => response.payload!));
  }

  createCompany(companyData: CompanyData): Observable<Company> {
    return this.http
      .post<ApiResponse<Company>>(ApiConstants.COMPANIES.BASE, companyData)
      .pipe(map((response) => response.payload!));
  }

  updateCompany(id: number, companyData: CompanyData): Observable<Company> {
    return this.http
      .put<ApiResponse<Company>>(ApiConstants.COMPANIES.BY_ID(id), companyData)
      .pipe(map((response) => response.payload!));
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(ApiConstants.COMPANIES.BY_ID(id));
  }
}
