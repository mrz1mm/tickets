/**
 * Rappresenta una struttura di dati paginata restituita dall'API.
 * È un tipo generico che può contenere qualsiasi tipo di dato.
 * @template T Il tipo degli elementi contenuti nella pagina.
 */
export interface PagedResult<T> {
  /**
   * L'array degli elementi per la pagina corrente.
   */
  content: T[];

  /**
   * Il numero della pagina corrente (basato su zero).
   */
  pageNumber: number;

  /**
   * La dimensione della pagina (quanti elementi per pagina).
   */
  pageSize: number;

  /**
   * Il numero totale di elementi disponibili su tutte le pagine.
   */
  totalElements: number;

  /**
   * Il numero totale di pagine disponibili.
   */
  totalPages: number;

  /**
   * Un flag booleano che indica se questa è l'ultima pagina.
   */
  last: boolean;
}
