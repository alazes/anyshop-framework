import { Component, Input, OnInit } from '@angular/core';
import { Color } from '@anyshop/core';
import * as Moment from 'moment';
import 'moment/locale/es';
import { Observable, timer } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { normalizeBooleanAttribute } from '../../helpers';

const moment = Moment; // https://github.com/rollup/rollup/issues/670#issuecomment-355945073

const MIN_MINUTES_TO_CONVERT_TO_HOURS = 120;

@Component({
  selector: 'elapsed-time-widget',
  templateUrl: './elapsed-time-widget.component.html',
  styleUrls: ['./elapsed-time-widget.component.scss'],
})
export class ElapsedTimeWidgetComponent implements OnInit {
  private _startTime: Moment.Moment | undefined;
  private _endTime: Moment.Moment | undefined;
  private _measureUnit: Moment.unitOfTime.Diff = 'm';
  private _fixedUnitOfTime = false;
  private _icon: string | string[] | false = ['far', 'clock'];

  @Input()
  color: Color | undefined;

  elapsedTime$!: Observable<number | undefined>;
  elapsedTime: number | undefined;

  @Input()
  /**
   * FontAwesome icon.
   */
  set icon(value) {
    if (!value || value === 'false') {
      this._icon = false;
    } else {
      this._icon = value;
    }
  }
  get icon() {
    return this._icon;
  }

  @Input()
  set startTime(value) {
    if (!value) {
      this._startTime = undefined;
    } else {
      this._startTime = moment(value);
    }
  }
  get startTime() {
    return this._startTime;
  }

  @Input()
  set endTime(value) {
    if (!value) {
      this._endTime = undefined;
    } else {
      this._endTime = moment(value);
    }
  }
  get endTime() {
    return this._endTime;
  }

  /**
   * Unidad de medida (Moment) en que que se mostrará el diferencial.
   */
  @Input()
  set measureUnit(value) {
    this._measureUnit = value;
  }
  get measureUnit() {
    return this._measureUnit;
  }

  /**
   * Etiqueta para la unidad de medida.
   */
  get measureUnitLabel() {
    let label: string;

    switch (this.measureUnit) {
      case 'm':
      case 'minute':
      case 'minutes':
        label = 'min';
        break;

      default:
        label = this.measureUnit;
        break;
    }

    return label;
  }

  /**
   * Indica si la unidad de medida de tiempo será fija.
   *
   * Por defecto, cambia automáticamente dependiendo del diferencial.
   */
  @Input()
  set fixedUnitOfTime(value) {
    this._fixedUnitOfTime = normalizeBooleanAttribute(value);
  }
  get fixedUnitOfTime() {
    return this._fixedUnitOfTime;
  }

  constructor() {}

  ngOnInit() {
    this.elapsedTime$ = timer(0, 5000).pipe(
      map(() => {
        if (this.startTime === undefined) {
          return undefined;
        }

        let diff: number;

        if (!this.fixedUnitOfTime) {
          diff = moment(this.endTime).diff(this.startTime, 'm', false);

          if (diff > MIN_MINUTES_TO_CONVERT_TO_HOURS) {
            this.measureUnit = 'h';
          }
        }

        diff = moment(this.endTime).diff(
          this.startTime,
          this.measureUnit,
          false
        );

        return diff;
      }),
      distinctUntilChanged()
    );

    this.elapsedTime$.subscribe((elapsedTime) => {
      // console.log({ elapsedTime });
      this.elapsedTime = elapsedTime;
    });
  }
}
