import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PaymentMethod } from '@anyshop/core';
import * as Moment from 'moment';

import {
  PaymentMethodExtension,
  normalizeBooleanAttribute,
} from '../../helpers';

const moment = Moment; // https://github.com/rollup/rollup/issues/670#issuecomment-355945073

@Component({
  selector: 'business-card',
  templateUrl: './business-card.component.html',
  styleUrls: ['./business-card.component.scss'],
})
export class BusinessCardComponent implements OnInit, OnDestroy {
  private _paymentMethods = PaymentMethodExtension.for(0);

  private _button = false;
  private _minutes = 15;

  startTime = moment();
  endTime = moment();

  set button(value) {
    this._button = normalizeBooleanAttribute(value);
  }
  get button(): boolean {
    return this._button;
  }

  @Input()
  class = 'ion-no-margin ion-margin-vertical';

  @Input()
  name?: string;

  @Input()
  ratingColor: string | undefined = 'primary';

  @Input()
  category?: string;

  @Input()
  stars: number | undefined;

  @Input()
  picture: string | undefined;

  @Input()
  minOrder = 0;

  @Input()
  set minutes(value) {
    this._minutes = +value || 0;

    this.endTime = this.startTime.clone().add(this.minutes, 'minute');
  }
  get minutes(): number {
    return this._minutes;
  }

  @Input()
  set paymentMethods(value) {
    this._paymentMethods = this.parsePaymentMethodsHtmlAttribute(value);
  }
  get paymentMethods() {
    return this._paymentMethods;
  }

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

  parsePaymentMethodsHtmlAttribute(
    flags:
      | PaymentMethod
      | PaymentMethodExtension
      | Array<
          | PaymentMethodExtension
          | PaymentMethod
          | number
          | string
          | IPaymentMethodWithKeys
        >
  ): PaymentMethodExtension {
    let pm = PaymentMethodExtension.for(0);

    const hasKey = (object: any): object is IPaymentMethodWithKeys =>
      'key' in object;

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
          } else if (hasKey(val)) {
            p = p = PaymentMethodExtension.fromKey(val.key).value;
          } else {
            p = val;
          }

          pm = PaymentMethodExtension.for(pm.addFlag(p));
        });
      }
    }

    return pm;
  }
}

interface IPaymentMethodWithKeys {
  [p: string]: any;
  key: string;
}
