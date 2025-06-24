import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

// Non abbiamo più bisogno di ToastService o TranslocoService qui!
// La loro logica è nell'intercettore.

import { ApiConstants } from '../../../core/constants/api.const';
import { ApiResponse } from '../../../core/interfaces/api-response.interface';
import { Pageable } from '../../../core/interfaces/pageable.interface';
import { PagedResult } from '../../../core/interfaces/paged-result.interface';
import { AddComment } from '../interfaces/add-comment.interface';
import { CreateTicket } from '../interfaces/create-ticket.interface';
import { TicketDetail } from '../interfaces/ticket-detail.interface';
import { TicketSummary } from '../interfaces/ticket-summary.interface';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private http = inject(HttpClient);

  /**
   * Recupera un elenco paginato di ticket.
   */
  public getTickets(
    pageable: Pageable
  ): Observable<PagedResult<TicketSummary> | null> {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());
    if (pageable.sort) {
      params = params.set('sort', pageable.sort);
    }

    return this.http
      .get<ApiResponse<PagedResult<TicketSummary>>>(
        ApiConstants.TICKETING.BASE_URL,
        { params }
      )
      .pipe(
        map((response) => response.payload),
        catchError(() => of(null))
      );
  }

  /**
   * Recupera i dettagli di un ticket.
   */
  public getTicketById(id: number): Observable<TicketDetail | null> {
    return this.http
      .get<ApiResponse<TicketDetail>>(ApiConstants.TICKETING.GET_BY_ID(id))
      .pipe(
        map((response) => response.payload),
        catchError(() => of(null))
      );
  }

  /**
   * Crea un nuovo ticket.
   */
  public createTicket(data: CreateTicket): Observable<TicketDetail | null> {
    return this.http
      .post<ApiResponse<TicketDetail>>(ApiConstants.TICKETING.BASE_URL, data)
      .pipe(
        map((response) => response.payload),
        catchError(() => of(null))
      );
  }

  /**
   * Aggiunge un commento a un ticket.
   */
  public addComment(
    ticketId: number,
    data: AddComment
  ): Observable<TicketDetail | null> {
    return this.http
      .post<ApiResponse<TicketDetail>>(
        ApiConstants.TICKETING.ADD_COMMENT(ticketId),
        data
      )
      .pipe(
        map((response) => response.payload),
        catchError(() => of(null))
      );
  }
}
