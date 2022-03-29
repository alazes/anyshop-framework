/**
 * Firma para la metadata de las exceptiones.
 *
 * Para implementar en la clase de la excepción usar la interface Exceptionable.
 */
export interface IExceptionInfo<TData = unknown> {
  /**
   * Error message.
   */
  message: string;

  /**
   * Error code.
   */
  code?: string | number;

  /**
   * Referencia al error que genera esta excepción.
   */
  innerError?: Error | Exceptionable | unknown;

  /**
   * Metadatos extra de la excepción
   */
  data?: TData;
}

/**
 * Representa a una excepción con metadata de IExceptionInfo.
 */
export type Exceptionable<TData = unknown> = Readonly<IExceptionInfo<TData>>;
