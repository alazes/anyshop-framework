import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Business, IProductData, Order, OrderItem, Product } from '@anyshop/core';
import * as firebase from 'firebase/app';
import * as _ from 'lodash';
import { OrdersService } from '../orders/orders.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class MyCartService {
  order: Order = new Order({});

  get items() {
    return this.order.items;
  }

  constructor(public http: HttpClient, public orders: OrdersService, public user: UserService) {
    // console.log('Inicializado servicio de MyCart');
  }

  addProductToCart(product: Product, count: number) {
    if (count > product.stock) {
      return false;
    }

    let item = this.items.find((orderItem) => {
      return orderItem.product.key === product.key;
    });

    if (!item) {
      item = new OrderItem({
        product,
        stockKey: product.stock_id,
      });

      this.addItemToCart(item as OrderItem);
    }

    item.qty += count;

    return true;
  }

  addItemToCart(item: OrderItem) {
    this.order.items.push(item);
  }

  /**
   * @deprecated
   */
  remove(item: any) {
    this.order.items.splice(this.order.items.indexOf(item), 1);
  }

  getSubTotalOrder() {
    return this.order.getSubTotalOrder();
  }

  getTotalOrder() {
    return this.order.getTotalOrder();
  }

  sanitizeOrder() {
    if (this.order.businessData.delivery_methods) {
      this.order.businessData.delivery_methods.forEach((deliveryMethod, index) => {
        this.order.businessData.delivery_methods[index] = _.omit(deliveryMethod, ['polygon_area', 'price_zones']);
      });
    }

    if (this.order.deliveryMethod) {
      this.order.deliveryMethod = _.omit(this.order.deliveryMethod, ['polygon_area', 'price_zones']);
    }
    this.order.businessData = _.omit(this.order.businessData, ['polygon_area']) as Business;
  }

  async sendOrder() {
    const deliveryAddress = this.order.deliveryAddress || this.user.primaryAddress;
    const userPhone = this.user.currentUser.phone || this.user.currentUser.phoneNumber;
    const serverDate = firebase.firestore.FieldValue.serverTimestamp();

    this.sanitizeOrder();
    this.order.packOrder(serverDate, this.user.currentUserId, this.user.displayName(), userPhone, deliveryAddress);

    const res = await this.orders.add(this.order);

    this.resetCart();

    return res;
  }

  resetCart() {
    // console.log('resetCart()');
    this.order = new Order({});
  }

  resetItems() {
    // console.log('resetItems()');
    this.order.items = [];
  }
}
