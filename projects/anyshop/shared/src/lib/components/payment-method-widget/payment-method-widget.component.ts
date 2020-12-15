import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaymentMethod } from '@anyshop/core';
import { PopoverController } from '@ionic/angular';
import { Color, OverlayEventDetail } from '@ionic/core';

import { ComponentsConfigService } from '../../components-config.service';
import {
  PaymentMethodExtension,
  normalizeBooleanAttribute,
} from '../../helpers';
import {
  IPaymentMethodData,
  PaymentMethodPopoverComponent,
} from '../payment-method-popover/payment-method-popover.component';

@Component({
  selector: 'payment-method-widget',
  templateUrl: './payment-method-widget.component.html',
  styleUrls: ['./payment-method-widget.component.scss'],
})
export class PaymentMethodWidgetComponent implements OnInit {
  private _lines: 'full' | 'inset' | 'none' | undefined = 'full';
  private _multiple = false;
  private _selected = new PaymentMethodExtension(0);
  private _howMuchPay = 0;
  private _availableMethods = new PaymentMethodExtension(0);
  private _placeholder: string | undefined;
  private _readonly = false;
  private _minCash = 0;
  selecting = false;

  @Input()
  set minCash(value: number) {
    this._minCash = +value || 0;
  }
  get minCash() {
    return this._minCash;
  }

  /**
   * Moneda a usar.
   */
  @Input()
  currencyCode: string;

  @Input()
  color?: Color;

  @Input()
  class?: string;

  @Input()
  set readonly(value) {
    this._readonly = normalizeBooleanAttribute(value);
  }
  get readonly() {
    return this._readonly;
  }

  @Input()
  set lines(value) {
    this._lines = value;
  }
  get lines() {
    return this._lines;
  }

  @Input()
  set placeholder(value: string) {
    this._placeholder = value;
  }

  get placeholder() {
    if (this._placeholder) {
      return this._placeholder;
    }

    if (this.multiple) {
      return 'Elige los métodos de pago';
    } else {
      return 'Elige el método de pago';
    }
  }

  @Input()
  set howMuchPay(value) {
    this._howMuchPay = +value;

    this.howMuchPayChange.emit(this._howMuchPay);
  }
  get howMuchPay() {
    return this._howMuchPay;
  }

  @Output()
  readonly howMuchPayChange = new EventEmitter<number>();

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
  }
  get availableMethods() {
    return this._availableMethods;
  }

  @Input()
  set selected(value) {
    this._selected = this.parsePaymentMethodsHtmlAttribute(value);

    this.selectedChange.emit(this._selected);
  }
  get selected() {
    return this._selected;
  }

  @Output()
  readonly selectedChange = new EventEmitter<PaymentMethodExtension>();

  constructor(
    private popoverController: PopoverController,
    config: ComponentsConfigService
  ) {
    this.currencyCode = config.defaultCurrency;
  }

  ngOnInit() {}

  parsePaymentMethodsHtmlAttribute(
    flags:
      | PaymentMethod
      | PaymentMethodExtension
      | Array<PaymentMethodExtension | PaymentMethod | number | string>
  ): PaymentMethodExtension {
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

    return pm;
  }

  async selectPayment(_ev?: any) {
    if (this.readonly || this.selecting) {
      return;
    }

    this.selecting = true;

    // console.log('PaymentMethodWidgetComponent::selectPayment()', _ev);

    const popover = await this.popoverController.create({
      component: PaymentMethodPopoverComponent,
      // event: _ev,
      componentProps: {
        availableMethods: this.availableMethods,
        minCash: this.minCash,
        howMuchPay: this.howMuchPay,
        multiple: this.multiple,
        selected: this.selected,
      },
      translucent: true,
    });

    // console.log('Creado');

    popover
      .onDidDismiss()
      .then((response: OverlayEventDetail<IPaymentMethodData>) => {
        if (response.role === 'selected' && response.data && response.data) {
          this.selected = PaymentMethodExtension.for(response.data.selected);
          this.howMuchPay = response.data.howMuchPay;
        }
      })
      .finally(() => {
        this.selecting = false;
      });

    // console.log('Evento de respuesta creado');

    await popover.present();
  }
}
