import { Component, Input } from '@angular/core';
import { Color } from '@ionic/core';

@Component({
  selector: 'category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss'],
})
export class CategoryCardComponent  {
  private _counter: number | undefined;

  @Input()
  title: string | undefined;

  @Input()
  image: string | undefined;

  @Input()
  color: Color | undefined;

  @Input()
  set counter(value) {
    if (typeof value === 'string' || typeof value === 'number') {
      this._counter = parseInt(`${value}`, 10);
    } else {
      this._counter = undefined;
    }
  }
  get counter() {
    return this._counter;
  }

  @Input()
  innerClass: string | undefined;

  @Input()
  routerLink: string | string[] | undefined;

  constructor() {}
}
