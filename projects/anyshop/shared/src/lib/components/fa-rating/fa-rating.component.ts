import { Component, Input, OnInit } from '@angular/core';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

const DEFAULT_FILLED_COLOR = 'rating-filled';
const DEFAULT_EMPTY_COLOR = 'rating-empty';
const DEFAULT_FILLED_ICON = ['fas', 'star'];
const DEFAULT_EMPTY_ICON = ['far', 'star'];

@Component({
  selector: 'fa-rating',
  templateUrl: './fa-rating.component.html',
  styleUrls: ['./fa-rating.component.scss'],
})
export class FaRatingComponent implements OnInit {
  private _total = 5;
  private _filledColor = DEFAULT_FILLED_COLOR;
  private _emptyColor = DEFAULT_EMPTY_COLOR;
  private _filledIcon: string | string[] = DEFAULT_FILLED_ICON;
  private _emptyIcon: string | string[] = DEFAULT_EMPTY_ICON;
  private _value: number | undefined;

  private _items = Array(5)
    .fill(0)
    .map((_x, i) => i + 1);

  /**
   * Tamaño interno del ícono.
   */
  @Input()
  size: SizeProp | undefined;

  @Input()
  set value(val) {
    if (typeof val === 'number') {
      this._value = val;
    } else {
      if (!val) {
        this._value = undefined;
      } else {
        this._value = parseFloat(val);
      }
    }
  }
  get value() {
    return this._value;
  }

  /**
   * Color de los íconos llenos.
   */
  @Input()
  set filledColor(value) {
    this._filledColor = value || DEFAULT_FILLED_COLOR;
  }
  get filledColor() {
    return this._filledColor;
  }

  /**
   * Color de los íconos vacíos.
   */
  @Input()
  set emptyColor(value) {
    this._emptyColor = value || DEFAULT_EMPTY_COLOR;
  }
  get emptyColor() {
    return this._emptyColor;
  }

  /**
   * Ícono de FA para relleno.
   */
  @Input()
  set filledIcon(value) {
    this._filledIcon = value || DEFAULT_FILLED_ICON;
  }
  get filledIcon() {
    return this._filledIcon;
  }

  /**
   * Ícono de FA para vacío.
   */
  @Input()
  set emptyIcon(value) {
    this._emptyIcon = value || DEFAULT_EMPTY_ICON;
  }
  get emptyIcon() {
    return this._emptyIcon;
  }

  /**
   * Total de íconos para el rating.
   */
  @Input()
  set total(value) {
    this._total = parseInt(`${value}`, 10);

    this._items = Array(this._total)
      .fill(0)
      .map((_x, i) => i + 1);
  }
  get total() {
    return this._total;
  }

  get items() {
    return this._items;
  }

  // Aliases ----

  /**
   * Alias para filledColor.
   */
  @Input()
  set color(value) {
    this.filledColor = value;
  }
  get color() {
    return this.filledColor;
  }

  /**
   * @deprecated Usar filledColor
   */
  @Input()
  set activeColor(value) {
    console.warn('Use `filledColor` instead');
    this.filledColor = value;
  }
  get activeColor() {
    return this.filledColor;
  }

  /**
   * @deprecated Usar emptyColor
   */
  @Input()
  set inactiveColor(value) {
    console.warn('Use `emptyColor` instead');
    this.emptyColor = value;
  }
  get inactiveColor() {
    return this.emptyColor;
  }

  /**
   * @deprecated Usar filledIcon
   */
  @Input()
  set activeIcon(value) {
    console.warn('Use `filledIcon` instead');
    this.filledIcon = value;
  }
  get activeIcon() {
    return this.filledIcon;
  }

  /**
   * @deprecated Usar emptyIcon
   */
  @Input()
  set inactiveIcon(value) {
    console.warn('Use `emptyIcon` instead');
    this.emptyIcon = value;
  }
  get inactiveIcon() {
    return this.emptyIcon;
  }

  constructor() {}

  ngOnInit() {}
}
