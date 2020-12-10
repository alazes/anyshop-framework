import { PaymentMethod } from '@anyshop/core';
import Flags from './flags';

/* tslint:disable:no-bitwise */

/**
 * @since 0.1.26
 * @author Nelson Martell <nelson6e65@gmail.com>
 */
export default class PaymentMethodExtension extends Flags<PaymentMethod> {
  static fromKey(key: string) {
    let pm = PaymentMethod.None;

    switch (key) {
      case 'cash':
        pm = PaymentMethod.Cash;
        break;
      case 'posvisa':
        pm = PaymentMethod.Visa;
        break;
      case 'posmastercard':
        pm = PaymentMethod.MasterCard;
        break;
    }

    return new this(pm);
  }


  faIcon(mode?: 'fas' | 'far'): string[] {
    let iconValue: string[];

    switch (this.value) {
      case PaymentMethod.Cash:
        iconValue = [mode || 'fas', 'money-bill-wave'];
        break;

      case PaymentMethod.Visa:
        iconValue = ['fab', 'cc-visa'];
        break;

      case PaymentMethod.MasterCard:
        iconValue = ['fab', 'cc-mastercard'];
        break;

      default:
        iconValue = [mode || 'fas', 'hand-holding-usd'];
    }

    return iconValue;
  }

  label() {
    let text: string;

    switch (this.value) {
      case PaymentMethod.Cash:
        text = 'Efectivo';
        break;

      case PaymentMethod.Visa:
        text = 'P.O.S. Visa';
        break;

      case PaymentMethod.Cash | PaymentMethod.Visa:
        text = 'Efectivo y P.O.S. Visa';
        break;

      case PaymentMethod.MasterCard:
        text = 'P.O.S. MasterCard';
        break;

      case PaymentMethod.Cash | PaymentMethod.MasterCard:
        text = 'Efectivo y P.O.S. MasterCard';
        break;

      case PaymentMethod.Visa | PaymentMethod.MasterCard:
        text = 'P.O.S. Visa y P.O.S. MasterCard';
        break;

      case PaymentMethod.All:
        text = 'Efectivo, P.O.S. Visa y P.O.S. Mastercard';
        break;

      default:
        text = 'Otro';
    }

    return text;
  }


  name(flagsSeparator?: string): string | undefined {
    if (this.value === 0) {
      return PaymentMethod[this.value]; // Cuando es none
    }

    const names: string[] = [];

    this.getFlags()
      .map((pm) => {
        names.push(PaymentMethod[pm]);
      });

    return names.join(flagsSeparator || ' | ');
  }


  color() {
    const name = this.name();

    if (name) {
      return `payment-method-${name.toLowerCase()}`;
    } else {
      return 'medium';
    }
  }

  /**
   * Obtiene cada instancia individual de los flags como array.
   */
  toArray(): PaymentMethodExtension[] {
    return this.getFlags()
      .map((method) => {
        return PaymentMethodExtension.for(method);
      });
  }
}
