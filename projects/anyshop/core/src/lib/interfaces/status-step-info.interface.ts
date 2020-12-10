import { OrderStatus } from '../enums';

/**
 * Indica la información a mostrar de cada estado paso a paso.
 */
export default interface IStatusStepInfo {
  status: OrderStatus;

  issuedAt?: Date;
  label?: string;
  message?: string;
  photo?: string;
  title?: string;
}
