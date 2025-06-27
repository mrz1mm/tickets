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
import { Pageable } from '../../../core/interfaces/pageable.interface';
import { PagedResult } from '../../../core/interfaces/paged-result.interface';
import { TicketStatus } from '../types/ticket-status.type';
import { UpdateTicketStatus } from '../interfaces/update-ticket-status.interface';

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
   * Recupera i ticket assegnati all'utente corrente con paginazione.
   * @param pageable Oggetto contenente le informazioni di paginazione.
   * @return Un Observable con i risultati paginati dei ticket assegnati all'utente.
   * */
  public getAssignedToMeTickets(
    pageable: Pageable
  ): Observable<PagedResult<TicketSummary>> {
    const params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());
    return this.http
      .get<ApiResponse<PagedResult<TicketSummary>>>(
        ApiConstants.TICKETS.ASSIGNED_TO_ME,
        { params }
      )
      .pipe(map((response) => response.payload!));
  }

  /**
   * Recupera i ticket non assegnati a nessun utente con paginazione.
   * @param pageable Oggetto contenente le informazioni di paginazione.
   * @return Un Observable con i risultati paginati dei ticket non assegnati.
   */
  public getUnassignedTickets(
    pageable: Pageable
  ): Observable<PagedResult<TicketSummary>> {
    const params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());
    return this.http
      .get<ApiResponse<PagedResult<TicketSummary>>>(
        ApiConstants.TICKETS.UNASSIGNED,
        { params }
      )
      .pipe(map((response) => response.payload!));
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
   * Cambia lo stato di un ticket.
   * @param ticketId L'ID del ticket da aggiornare.
   * @param status Il nuovo stato del ticket.
   * @return Un Observable con il Ticket aggiornato.
   * */
  public changeStatus(
    ticketId: number,
    status: TicketStatus
  ): Observable<TicketDetail> {
    const payload: UpdateTicketStatus = { status };
    return this.http
      .patch<ApiResponse<TicketDetail>>(
        ApiConstants.TICKETS.CHANGE_STATUS(ticketId),
        payload
      )
      .pipe(map((response) => response.payload!));
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
