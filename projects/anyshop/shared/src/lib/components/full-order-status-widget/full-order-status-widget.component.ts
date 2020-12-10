import { Component, Input, OnInit } from '@angular/core';
import { OrderStatus } from '@anyshop/core';
import { OrderStatusExtension } from '../../helpers';
import { IStatusStepInfo } from '@anyshop/core';

@Component({
  selector: 'full-order-status-widget',
  templateUrl: './full-order-status-widget.component.html',
  styleUrls: ['./full-order-status-widget.component.scss'],
})
export class FullOrderStatusWidgetComponent implements OnInit {
  private _steps: IStatusStepInfo[] = [];
  private _status: OrderStatus = OrderStatus.Undefined;
  private _timeFormat = 'HH:mm';

  public readonly rejectedStatusInfo: IStatusStepInfo = {
    status: OrderStatus.Rejected,
    label: `OrderStatus.Rejected.label`,
    message: `OrderStatus.Rejected.message`,
    title: `OrderStatus.Rejected.title`,
  };

  showStepsDetails = false;

  @Input()
  typeOrder: 'delivery' | 'takeaway' | undefined;

  @Input()
  set steps(value) {
    this._steps = value || [];
  }
  get steps() {
    return this._steps;
  }

  @Input()
  set timeFormat(value) {
    this._timeFormat = value;
  }
  get timeFormat() {
    return this._timeFormat;
  }

  @Input()
  set status(value) {
    this._status = value;
  }
  get status() {
    return this._status;
  }

  get currentIndex() {
    if (this.completed) {
      return this.steps.length - 1;
    }

    return this.steps.findIndex((s) => {
      return s.status === this.status;
    });
  }

  get maxStatus() {
    return this.steps[this.steps.length - 1].status;
  }

  get completed() {
    return this.status >= this.maxStatus;
  }

  get rejected() {
    return this.status < 0;
  }

  get icon() {
    if (this.rejected) {
      return ['fas', 'times-circle'];
    } else if (this.completed) {
      return ['fas', 'check-circle'];
    } else {
      return ['far', 'clock'];
    }
  }

  get currentProgress() {
    if (this.rejected || this.completed) {
      return 1;
    }

    return (this.currentIndex + 1) / this.steps.length;
  }

  get currentTitle() {
    if (this.rejected) {
      return this.rejectedStatusInfo.title;
    }

    return this.steps[this.currentIndex].title;
  }

  get currentLabel() {
    if (this.rejected) {
      return this.rejectedStatusInfo.label;
    }

    return this.steps[this.currentIndex].label;
  }

  get currentMessage() {
    if (this.rejected) {
      return this.rejectedStatusInfo.message;
    }

    return this.steps[this.currentIndex].message;
  }

  constructor() {}

  ngOnInit() {
    // console.log('Status:', this.steps);
  }

  defaultLabel(status: OrderStatus) {
    return OrderStatusExtension.for(status).label();
  }
}
