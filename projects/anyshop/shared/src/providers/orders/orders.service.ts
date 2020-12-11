import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { Order, OrderStatus, Rate } from '@anyshop/core';
import { ApiService } from '@arxis/api';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import * as _ from 'lodash';

import { FirebaseItemsAbstractService } from '../firebase/firebase-items-abstract.service';

@Injectable({ providedIn: 'root' })
export class OrdersService extends FirebaseItemsAbstractService<Order> {
  protected get endpoint() {
    return 'api/orders';
  }

  constructor(
    public db: AngularFirestore,
    private localNotifications: LocalNotifications,
    private api: ApiService
  ) {
    super('/orders', db);
  }

  mapElements(action: DocumentChangeAction<Order>) {
    const itemEl = super.mapElements(action);
    const order = new Order(itemEl);

    if (!order.deliveryManRef) {
      order.deliveryManRef = this.afs
        .collection('users')
        .doc(order.businessData.owner).ref;
    }

    this.fixDates(order);
    order.status = itemEl.status;
    order.rate = itemEl.rate;
    order.paymentMethod = itemEl.paymentMethod;

    return order;
  }

  fixDates(order: Order) {
    if (order.createdAt && (order.createdAt as any).seconds) {
      order.createdAt = new Date((order.createdAt as any).seconds * 1000);
    }

    if (order.acceptedAt && (order.acceptedAt as any).seconds) {
      order.acceptedAt = new Date((order.acceptedAt as any).seconds * 1000);
    }

    if (order.rejectedAt && (order.rejectedAt as any).seconds) {
      order.rejectedAt = new Date((order.rejectedAt as any).seconds * 1000);
    }

    if (order.deliveredAt && (order.deliveredAt as any).seconds) {
      order.deliveredAt = new Date((order.deliveredAt as any).seconds * 1000);
    }

    if (order.deliveryStartedAt && (order.deliveryStartedAt as any).seconds) {
      order.deliveryStartedAt = new Date(
        (order.deliveryStartedAt as any).seconds * 1000
      );
    }

    if (order.ratedAt && (order.ratedAt as any).seconds) {
      order.ratedAt = new Date((order.ratedAt as any).seconds * 1000);
    }
  }

  async create(data: Order): Promise<{ id: string }> {
    const simplifiedData = _.omit(
      data.serialize(),
      'createdAt',
      'updatedAt',
      'deletedAt'
    );

    if (simplifiedData.deliveryManRef) {
      simplifiedData.deliveryManRef = simplifiedData.deliveryManRef.path as any;
    }

    simplifiedData.items = simplifiedData.items.map((item) => {
      item.product.ownerRef = item.product.ownerRef.path as any;

      return item;
    });

    // console.log('Data a enviar', simplifiedData);

    const result = ((await this.api
      .post(this.endpoint, _.omitBy(simplifiedData, _.isUndefined))
      .toPromise()) as unknown) as {
      id: string;
    };

    return result;
  }

  /**
   * @deprecated Use create() method instead
   */
  async add(item: Order) {
    console.warn('Deprecated: add(). Use create() method instead');

    return (await this.create(item)) as any;
  }

  /**
   * @deprecated Usar explicitamente el estado con `setStatus()`.
   */
  async deliver(order: Order): Promise<void> {
    const dateOfDelivery = new Date();

    return this.update(order, {
      delivered: true,
      deliveredAt: dateOfDelivery,
      status: OrderStatus.Delivered,
      _status: OrderStatus.Delivered,
    }).then(() => {
      order.delivered = true;
      order.deliveredAt = dateOfDelivery;
      // Temporal se borran todas con Id 1
      this.localNotifications.clear(1);

      console.log('Pedido Entregado', order.key);
    });
  }

  /**
   * @deprecated Usar explicitamente el estado con `setStatus()`.
   */
  async accept(order: Order): Promise<void> {
    const dateOfAccept = new Date();

    return this.update(order, {
      accepted: true,
      acceptedAt: dateOfAccept,
      status: OrderStatus.Confirmed,
      _status: OrderStatus.Confirmed,
    }).then(() => {
      order.accepted = true;
      order.acceptedAt = dateOfAccept;
      // Temporal se borran todas con Id 1
      // this.localNotifications.clear(1);

      this.localNotifications.schedule({
        id: 1,
        text: '¡Te estan esperando!',
        trigger: { at: new Date(new Date().getTime() + 15 * 60 * 1000) },
        sound: 'res://phone.wav',
        // sound: 'false',
        data: {
          orderID: order.key,
        },
      });

      console.log('Pedido Aceptado', order.key);
    });
  }

  /**
   * @deprecated Usar explicitamente el estado con `setStatus()`.
   */
  async reject(order: Order): Promise<void> {
    const dateOfReject = new Date();

    return this.update(order, {
      rejected: true,
      rejectedAt: dateOfReject,
      status: OrderStatus.Rejected,
    }).then(() => {
      order.rejected = true;
      order.rejectedAt = dateOfReject;
      // order.status = OrderStatus.Rejected;
      console.log('Pedido Rechazado', order.key);
    });
  }

  /**
   * Inicia la entrega del pedido.
   *
   * @deprecated Usar explicitamente el estado con `setStatus()`.
   */
  async startDelivery(order: Order): Promise<void> {
    const deliveryStartedAt = new Date();

    await this.update(order, {
      deliveryStartedAt,
      status: OrderStatus.Delivering,
      _status: OrderStatus.Delivering,
    });
    order.deliveryStartedAt = deliveryStartedAt;
  }

  /**
   * Califica el pedido.
   *
   */
  public async rate(
    order: Order,
    rate?: Rate,
    rateComment?: string
  ): Promise<void> {
    const ratedAt = new Date();

    if (rate === undefined) {
      rate = order.rate;
    }

    await this.update(order, {
      rate,
      ratedAt,
      status: OrderStatus.Rated,
      rateComment,
    });

    order.rate = rate;
    order.ratedAt = ratedAt;
    order.rateComment = rateComment;
  }

  public async setStatus(
    order: Order,
    status: OrderStatus,
    metadata: { photo?: string } = {}
  ) {
    const data = {
      status,
    };

    if (metadata.photo) {
      data[`photoByStatus.${status}`] = metadata.photo;
    }

    await this.update(order, data);
  }
}
