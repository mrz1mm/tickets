import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiConstants } from '../../../core/constants/api.const';
import { ApiResponse } from '../../../core/interfaces/api-response.interface';
import { AddComment } from '../interfaces/add-comment.interface';
import { TicketDetail } from '../interfaces/ticket-detail.interface';
import { CreateTicket } from '../interfaces/create-ticket.interface';
import { TicketSummary } from '../interfaces/ticket-summary.interface';
import { UpdateTicket } from '../interfaces/update-ticket.interface';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private http = inject(HttpClient);

  /**
   * Recupera la lista di tutti i ticket in formato riassuntivo.
   */
  public getAllTickets(): Observable<TicketSummary[]> {
    return this.http
      .get<ApiResponse<TicketSummary[]>>(ApiConstants.TICKETS.BASE)
      .pipe(map((response) => response.payload ?? []));
  }

  /**
   * Recupera un singolo ticket con tutti i suoi dettagli.
   */
  public getTicketById(id: number): Observable<TicketDetail> {
    return this.http
      .get<ApiResponse<TicketDetail>>(ApiConstants.TICKETS.BY_ID(id))
      .pipe(map((response) => response.payload!));
  }

  /**
   * Crea un nuovo ticket.
   */
  public createTicket(ticketData: CreateTicket): Observable<TicketDetail> {
    return this.http
      .post<ApiResponse<TicketDetail>>(ApiConstants.TICKETS.BASE, ticketData)
      .pipe(map((response) => response.payload!));
  }

  /**
   * Aggiorna un ticket esistente.
   * @param id L'ID del ticket da aggiornare.
   * @param ticketData I nuovi dati del ticket (solo i campi da modificare).
   * @returns Un Observable con il Ticket aggiornato.
   */
  public updateTicket(
    id: number,
    ticketData: UpdateTicket
  ): Observable<TicketDetail> {
    return this.http
      .put<ApiResponse<TicketDetail>>(
        ApiConstants.TICKETS.BY_ID(id),
        ticketData
      )
      .pipe(map((response) => response.payload!));
  }

  /**
   * Elimina un ticket (soft delete).
   * @param id L'ID del ticket da eliminare.
   * @returns Un Observable<void> che si completa al successo.
   */
  public deleteTicket(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(ApiConstants.TICKETS.BY_ID(id))
      .pipe(
        map(() => void 0) // Trasforma la risposta in un void per l'observable
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
        ApiConstants.TICKETS.ADD_COMMENT(ticketId),
        data
      )
      .pipe(map((response) => response.payload));
  }
}
