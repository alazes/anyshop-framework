/* eslint-disable no-bitwise */

/**
 * Métodos de pago.
 *
 * @flag
 * @since 0.1.26
 */
enum PaymentMethod {
  None = 0,
  Cash = 1,
  Visa = 2,
  MasterCard = 4,
  All = Cash | Visa | MasterCard,
}

export default PaymentMethod;
