import { Component, Input, OnInit } from '@angular/core';
import { Rate } from '@anyshop/core';

import { RateExtension, normalizeBooleanAttribute } from '../../helpers';

@Component({
  selector: 'rate-icon',
  templateUrl: './rate-icon.component.html',
  styleUrls: ['./rate-icon.component.scss'],
})
export class RateIconComponent implements OnInit {
  private _value: RateExtension = new RateExtension(Rate.None);
  private _selected = false;

  @Input()
  set value(value) {
    if (!value) {
      this._value = new RateExtension(Rate.None);

      return;
    }

    if (value instanceof RateExtension) {
      this._value = value;
    } else {
      this._value = new RateExtension(value as Rate);
    }
  }
  get value() {
    return this._value;
  }

  @Input()
  set selected(value) {
    this._selected = normalizeBooleanAttribute(value);
  }
  get selected() {
    return this._selected;
  }

  constructor() {}

  ngOnInit() {}
}
