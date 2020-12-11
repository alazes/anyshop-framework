import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Color } from '@ionic/core';

import { normalizeBooleanAttribute } from '../../helpers';

@Component({
  selector: 'desplegable-card',
  templateUrl: './desplegable-card.component.html',
  styleUrls: ['./desplegable-card.component.scss'],
})
export class DesplegableCardComponent implements OnInit, OnDestroy {
  private _isOpen = false;

  @Input()
  title = '';

  @Input()
  class = 'ion-no-margin ion-margin-vertical';

  @Input()
  color: Color | undefined;

  @Input()
  headerColor: Color | undefined;

  @Input()
  set isOpen(value) {
    this._isOpen = normalizeBooleanAttribute(value);
  }
  get isOpen() {
    return this._isOpen;
  }

  constructor() {
    //
  }

  ngOnDestroy() {
    //
  }

  ngOnInit() {
    //
  }

  toggleContent() {
    return (this.isOpen = !this.isOpen);
  }
}
