import { DocumentReference } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import * as _ from 'lodash';

import { OrderStatus, PaymentMethod, Rate } from '../enums';

import { Model } from './abstract-model';
import Address from './address';
import Business from './business';
import DeliveryMethod from './delivery-method';
import OrderItem from './order-item';
import IOrderItem from './order-item.interface';

class Order extends Model {
  status: OrderStatus = OrderStatus.Undefined;
  statusesDates: { [status: number]: Date | firebase.firestore.Timestamp } = {};
  photoByStatus: { [status: number]: string } = {};

  acceptTerms = false;
  paymentMethod: PaymentMethod = PaymentMethod.None;
  business: string;
  businessData: Business;
  createdAt:
    | Date
    | firebase.firestore.Timestamp
    | firebase.firestore.FieldValue;
  customer: string;
  customerData: any;
  key: string;
  accepted = false;
  acceptedAt: Date | firebase.firestore.Timestamp;
  rejected = false;
  rejectedAt: Date | firebase.firestore.Timestamp;
  rejectedBy: string | undefined;
  delivered = false;
  deliveryAddress: Address;
  deliveredAt: Date | firebase.firestore.Timestamp;
  deliveryMethod: DeliveryMethod;
  deliveryCost: number;
  howMuchPay?: number;
  items: (OrderItem | IOrderItem)[] = [];
  deferredDeliveryTime?: any;
  /**
   * @deprecated
   */
  comments: string | undefined;
  rateComment: string | undefined;
  /**
   * @deprecated
   */
  rating: string | number | undefined;
  typeOrder: 'delivery' | 'takeaway' | undefined; // TODO: 💩 Cambiar implementación por un enum, como status
  deliveryPhoto: string | undefined;

  /**
   * Obtiene o establece el momento en que inicia la entrega del pedido.
   */
  deliveryStartedAt?: Date | firebase.firestore.Timestamp;
  elapsedTime?: number; // minutos
  /**
   * Obtiene o establece la calificación del pedido
   */
  rate: Rate = 0;

  /**
   * Indica si el cliente ha establecido este pedido como favorito.
   */
  favorite = false;

  /**
   * Obtiene o establece el momento en que califica el pedido.
   */
  ratedAt?: Date | firebase.firestore.Timestamp;

  /**
   * Referencia al repartidor del pedido.
   */
  deliveryManRef: DocumentReference | undefined;

  constructor(fields: { [field: string]: any } = {}) {
    super(fields);

    // FIXME: Deserializar correctamente los campos desde fields

    this.favorite = fields.favorite === true;

    this.deliveryManRef = fields.deliveryManRef;

    this.rate = fields.rate || 0;
    this.status = fields.status || 0;
    this.paymentMethod = fields.paymentMethod || 0;

    const items: any[] = fields.items || [];

    this.items = items.map((item: OrderItem | IOrderItem) => {
      if (item instanceof OrderItem) {
        return item;
      }
      return new OrderItem(item);
    });
  }

  getSubTotalOrder() {
    let total = 0;
    this.items.forEach((e: OrderItem) => {
      total += e.getTotal();
    });

    return total;
  }

  getTotalOrder() {
    return this.getSubTotalOrder() + (this.deliveryCost || 0);
  }

  /**
   * Empaqueta los datos (los serializa) para ser guardados.
   */
  packOrder(
    dateTime:
      | firebase.firestore.FieldValue
      | Date
      | firebase.firestore.Timestamp,
    customer: string,
    name: string,
    phone?: string,
    address?: Address
  ) {
    this.createdAt = dateTime;
    this.customer = customer;
    this.status = OrderStatus.Requested;

    this.items = this.items.map((i) => {
      if (i instanceof OrderItem) {
        return i;
      } else {
        return new OrderItem(i);
      }
    });

    this.statusesDates[this.status] = this
      .createdAt as firebase.firestore.Timestamp;

    this.customerData = {
      name: name || 'NO_NAME',
      phone,
    };
    if (!this.deliveryAddress) {
      this.deliveryAddress = address;
    }
  }

  /**
   * Obtiene este objeto pero sin métodos ni valores undefined.
   *
   * También serializa los items.
   */
  serialize(): Partial<Order> {
    const serialized = _.pickBy<Order>(
      this,
      (v) => v !== undefined && typeof v !== 'function'
    );

    serialized.items = (serialized.items || []).map((i) => {
      if (i instanceof OrderItem) {
        return i.serialize();
      }

      return i;
    });

    return serialized;
  }
}

export default Order;
