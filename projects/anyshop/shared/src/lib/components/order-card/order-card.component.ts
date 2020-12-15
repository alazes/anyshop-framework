import { Component, Input, OnInit } from '@angular/core';
import { OrderStatus } from '@anyshop/core';
import { IStatusStepInfo } from '@anyshop/core';
import { Business, Order } from '@anyshop/core';

import { ComponentsConfigService } from '../../components-config.service';
import { OrderStatusExtension, normalizeBooleanAttribute } from '../../helpers';

@Component({
  selector: 'order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss'],
})
export class OrderCardComponent implements OnInit {
  private _forBusiness = false;
  private _unitOfTime = 'm';
  private _fixedUnitOfTime = false;
  private _order!: Order;

  steps: IStatusStepInfo[] = [];

  @Input()
  set order(value) {
    if (!(value instanceof Order)) {
      throw new Error('Tipo inválido para la orden');
    }

    this._order = value;

    this.syncSteps();
  }
  get order() {
    return this._order;
  }

  @Input()
  /**
   * Clases del <ion-card>
   */
  classes = 'ion-margin-bottom';

  /**
   * Moneda a usar.
   */
  @Input()
  currencyCode: string;

  @Input()
  set forBusiness(value) {
    this._forBusiness = normalizeBooleanAttribute(value);
  }
  get forBusiness() {
    return this._forBusiness;
  }

  @Input()
  ratingColor: string | undefined;

  @Input()
  set unitOfTime(value) {
    this._unitOfTime = value;
  }
  get unitOfTime() {
    return this._unitOfTime;
  }

  @Input()
  set fixedUnitOfTime(value) {
    this._fixedUnitOfTime = normalizeBooleanAttribute(value);
  }
  get fixedUnitOfTime() {
    return this._fixedUnitOfTime;
  }

  get status() {
    return OrderStatusExtension.for(this.order.status);
  }

  get statusTitle() {
    return `OrderStatus.${this.status.name()}.title`;
  }

  get rated() {
    return this.status.value === OrderStatus.Rated;
  }

  get completedAt() {
    return this.order.statusesDates[OrderStatus.Delivered];
  }

  get rejected() {
    return this.status.value < 0;
  }

  get completed() {
    return this.status.value >= OrderStatus.Delivered;
  }

  get cost() {
    return this.order.getTotalOrder();
  }

  get key() {
    return this.order.key;
  }

  get business(): Business {
    return this.order.businessData;
  }

  get customer() {
    return this.order.customerData;
  }

  get totalProducts() {
    let count = 0;

    this.order.items.forEach((orderItem) => {
      count += orderItem.qty;
    });

    return count;
  }

  get statusIcon() {
    if (this.rejected) {
      return ['fas', 'times-circle'];
    } else if (this.completed) {
      return ['fas', 'check-circle'];
    } else {
      return ['far', 'clock'];
    }
  }

  get orderTypeIcon() {
    let icon;

    switch (this.order.typeOrder) {
      case 'delivery':
        icon = ['fas', 'biking'];
        break;
      case 'takeaway':
        icon = ['fas', 'shopping-bag'];
        break;

      default:
        icon = ['fas', 'paper-plane'];
        break;
    }

    return icon;
  }

  get currentStepIndex() {
    const i = this.steps.findIndex((s) => s.status === this.status.value);

    if (i < 0) {
      return this.steps.length - 1;
    }

    return i;
  }

  get currentProgress() {
    if (this.rejected || this.completed) {
      return 1;
    }

    return (this.currentStepIndex + 1) / this.steps.length;
  }

  constructor(config: ComponentsConfigService) {
    this.currencyCode = config.defaultCurrency;
  }

  ngOnInit() {
    if (!this.order) {
      console.error('No se pasó la orden o está undefined.');
    }

    this.syncSteps();
  }

  syncSteps() {
    if (this.order.typeOrder === 'delivery') {
      this.steps = [
        { status: OrderStatus.Requested },
        { status: OrderStatus.Confirmed },
        { status: OrderStatus.Preparing },
        { status: OrderStatus.Delivering },
        { status: OrderStatus.Arrived },
        { status: OrderStatus.Delivered },
      ];
    } else {
      this.steps = [
        { status: OrderStatus.Requested },
        { status: OrderStatus.Confirmed },
        { status: OrderStatus.Preparing },
        { status: OrderStatus.Delivered },
      ];
    }
  }
}
