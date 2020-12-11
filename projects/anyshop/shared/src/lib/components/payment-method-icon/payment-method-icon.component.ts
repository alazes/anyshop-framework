import { Component, Input, OnInit } from '@angular/core';
import { PaymentMethod } from '@anyshop/core';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

import {
  PaymentMethodExtension,
  normalizeBooleanAttribute,
} from '../../helpers';

@Component({
  selector: 'payment-method-icon',
  templateUrl: './payment-method-icon.component.html',
  styleUrls: ['./payment-method-icon.component.scss'],
})
export class PaymentMethodIconComponent implements OnInit {
  private _value: PaymentMethodExtension = new PaymentMethodExtension(
    PaymentMethod.None
  );
  private _simple = false;

  @Input()
  set value(value) {
    if (!value) {
      this._value = new PaymentMethodExtension(PaymentMethod.None);

      return;
    }

    if (value instanceof PaymentMethodExtension) {
      this._value = value;
    } else {
      this._value = new PaymentMethodExtension(value as PaymentMethod);
    }
  }
  get value() {
    return this._value;
  }

  @Input()
  color: string | undefined;

  @Input()
  size: SizeProp = '1x';

  @Input()
  set simple(value) {
    this._simple = normalizeBooleanAttribute(value);
  }

  get simple(): boolean {
    return this._simple;
  }

  constructor() {}

  ngOnInit() {}
}
