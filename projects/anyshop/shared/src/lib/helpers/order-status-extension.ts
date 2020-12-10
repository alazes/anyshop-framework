import { OrderStatus } from '@anyshop/core';
import EnumExtension from './enum-extension';

/**
 * @since 0.1.26
 * @author Nelson Martell <nelson6e65@gmail.com>
 */
export default class OrderStatusExtension extends EnumExtension<OrderStatus> {
  /**
   * Obtiene el nombre del valor en el enum ('Rejected', 'Confirmed', etc...).
   */
  public name(): string {
    return OrderStatus[this.value];
  }

  public label(): string {
    return this.name();
  }
}
