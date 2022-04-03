import { Component, Input } from '@angular/core';
import { PaymentMethod } from '@anyshop/core';
import { PopoverController } from '@ionic/angular';
import { max } from 'lodash';

import { ComponentsConfigService } from '../../components-config.service';
import {
  PaymentMethodExtension,
  normalizeBooleanAttribute,
} from '../../helpers';

@Component({
  selector: 'payment-method-popover',
  templateUrl: './payment-method-popover.component.html',
  styleUrls: ['./payment-method-popover.component.scss'],
})
export class PaymentMethodPopoverComponent {
  private _multiple = false;
  private _selected = new PaymentMethodExtension(0);
  private _howMuchPay = 0;
  private _minCash = 0;
  private _availableMethods = new PaymentMethodExtension(0);

  availableMethodsList: PaymentMethodExtension[] = [];

  keyboardActive = false;

  @Input()
  set howMuchPay(value: number) {
    this._howMuchPay = max([this.minCash, +value || 0]) || 0;
  }
  get howMuchPay() {
    return this._howMuchPay;
  }

  @Input()
  set minCash(value: number) {
    this._minCash = +value || 0;
  }
  get minCash() {
    return this._minCash;
  }

  @Input()
  set multiple(value) {
    this._multiple = normalizeBooleanAttribute(value);
  }

  get multiple() {
    return this._multiple;
  }

  @Input()
  set availableMethods(value) {
    this._availableMethods = this.parsePaymentMethodsHtmlAttribute(value);

    this.availableMethodsList = this._availableMethods.toArray();
  }

  get availableMethods() {
    return this._availableMethods;
  }

  /**
   * Moneda a usar.
   */
  @Input()
  currencyCode: string;

  @Input()
  set selected(value) {
    this._selected = this.parsePaymentMethodsHtmlAttribute(value);
  }

  get selected() {
    return this._selected;
  }

  get header() {
    if (this.multiple) {
      return 'Payment methods';
    } else {
      return 'Payment method';
    }
  }

  constructor(
    private controller: PopoverController,
    config: ComponentsConfigService
  ) {
    this.currencyCode = config.defaultCurrency;
  }

  isCash(method: PaymentMethod): boolean {
    return method === PaymentMethod.Cash;
  }

  select(method: PaymentMethodExtension) {
    if (this.multiple) {
      // TODO: Agregar un método de toggle (n ^= mask)
      /* eslint-disable no-bitwise */
      this.selected = PaymentMethodExtension.for(
        this.selected.value ^ method.value
      );
    } else {
      this.selected = method;
    }
  }

  parsePaymentMethodsHtmlAttribute(
    flags:
      | PaymentMethod
      | PaymentMethodExtension
      | Array<PaymentMethodExtension | PaymentMethod | number | string>
  ): PaymentMethodExtension {
    // console.log('PaymentMethodPopoverComponent::parsePaymentMethodsHtmlAttribute()');
    //
    // console.log('params:', flags);

    let pm = PaymentMethodExtension.for(0);

    if (flags) {
      if (flags instanceof PaymentMethodExtension) {
        pm = flags;
      } else if (typeof flags === 'number') {
        pm = PaymentMethodExtension.for(flags as PaymentMethod);
      } else if (flags.length > 0) {
        flags.forEach((val) => {
          let p = PaymentMethod.None;

          if (typeof val === 'string') {
            p = PaymentMethodExtension.fromKey(val).value;
          } else if (val instanceof PaymentMethodExtension) {
            p = val.addFlag(p);
          } else {
            p = val;
          }

          pm = PaymentMethodExtension.for(pm.addFlag(p));
        });
      }
    }

    // console.log('return:', pm);

    return pm;
  }

  async confirm() {
    if (
      !this.selected.value ||
      (!this.multiple && this.isCash(this.selected.value) && !this.howMuchPay)
    ) {
      return;
    }
    const data: IPaymentMethodData = {
      selected: this.selected.value,
      howMuchPay: this.isCash(this.selected.value) ? this.howMuchPay : 0,
      type: 'payment_method',
    };

    // console.log('Data:', data);

    await this.controller.dismiss(data, 'selected');
  }
}

export interface IPaymentMethodData {
  selected: PaymentMethod;
  howMuchPay: number;
  type: string;
}

export interface Contact {
  selected: string;
  type: string;
}
