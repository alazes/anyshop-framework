/**
 * Estado de la orden.
 */
enum OrderStatus {
  /**
   * Rechazado
   */
  Rejected = -1,
  Undefined = 0,

  /**
   * Solicitado.
   */
  Requested = 1,

  /**
   * Confirmado.
   */
  Confirmed = 2,

  /**
   * En preparación.
   */
  Preparing = 3,

  /**
   * En camino.
   */
  Delivering = 4,

  /**
   * En punto de entrega.
   */
  Arrived = 5,

  /**
   * Entregado.
   */
  Delivered = 6,

  /**
   * Calificado.
   */
  Rated = 7,
}

export default OrderStatus;
