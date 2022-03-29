import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { Product, Stock } from '@anyshop/core';
import firebase from 'firebase/app';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { FirebaseItemsAbstractService } from '../firebase/firebase-items-abstract.service';

@Injectable({ providedIn: 'root' })
export class StockService extends FirebaseItemsAbstractService<Stock> {
  constructor(public afs: AngularFirestore) {
    super('/stock', afs);
  }

  mapElements(action: DocumentChangeAction<Stock>) {
    const itemEl = action.payload.doc.data();
    itemEl.key = action.payload.doc.id;

    if (itemEl.product) {
      itemEl.product = new Product(itemEl.product);
      itemEl.product.key = itemEl.productRef.id;
    }

    return itemEl;
  }

  add(item: Stock): Promise<any> {
    const newStock = new Promise((resolve, reject) => {
      const productExistFunction = (ref) =>
        ref
          .where('productRef', '==', item.productRef)
          .where('businessRef', '==', item.businessRef);
      const queryExist = this.query(productExistFunction);
      const queryExistSub = queryExist.subscribe(
        (currentStock: Stock[]) => {
          if (!currentStock.length) {
            const normalObject: any = this.toJSON(item);
            super
              .add(normalObject)
              .then((res) => {
                resolve(true);
              })
              .catch((err) => {
                reject(err);
              });
          } else {
            const productStock = currentStock[0];
            productStock.quantity = productStock.quantity * 1;
            const updateDataStock = {
              price: item.price,
              quantity: item.quantity + productStock.quantity,
              product: undefined,
            };
            if (!productStock.product) {
              updateDataStock.product = item.product;
            }
            this.updateByKey(productStock.key, updateDataStock)
              .then(() => {
                resolve(true);
              })
              .catch((err) => {
                reject(err);
              });
          }
          queryExistSub.unsubscribe();
        },
        (err) => {
          reject(err);
        }
      );
    });

    return newStock;
  }

  modify(item: Stock): Promise<Stock> {
    const newStock: Promise<Stock> = new Promise((resolve, reject) => {
      const productExistFunction = (ref) =>
        ref
          .where('productRef', '==', item.productRef)
          .where('businessRef', '==', item.businessRef);
      const queryExist = this.query(productExistFunction);
      const queryExistSub = queryExist.subscribe(
        (currentStock: Stock[]) => {
          if (!currentStock.length) {
            const normalObject: any = this.toJSON(item);
            this.add(normalObject)
              .then((res: Stock) => {
                resolve(res);
              })
              .catch((err) => {
                reject(err);
              });
          } else {
            const productStock = currentStock[0] as Stock;
            productStock.quantity = productStock.quantity * 1;
            const updateDataStock: any = {
              price: item.price,
              quantity: item.quantity,
            };
            if (!productStock.product) {
              updateDataStock.product = item.product;
            }
            this.updateByKey(productStock.key, updateDataStock)
              .then(() => {
                productStock.price = item.price;
                productStock.quantity = item.quantity;
                resolve(productStock);
              })
              .catch((err) => {
                reject(err);
              });
          }
          queryExistSub.unsubscribe();
        },
        (err) => {
          reject(err);
        }
      );
    });

    return newStock;
  }

  getRemainingStock(businessId: string): Observable<any> {
    const businessRef = this.afs.collection('businesses').doc(businessId).ref;

    return this.query((ref) =>
      ref.where('businessRef', '==', businessRef).where('quantity', '<', 5)
    );
  }

  /**
   * Filtra el stock del negocio para la categoría especificada.
   *
   * Se puede usar el tercer parámetro para filtrar según la cantidad mín/máx de productos en stock.
   */
  filterByBusiness<
    C extends firebase.firestore.DocumentData,
    B extends firebase.firestore.DocumentData
  >(
    businessRef: firebase.firestore.DocumentReference<B>,
    categoryRef: firebase.firestore.DocumentReference<C>,
    quantityOptions: { min?: number; max?: number } = {}
  ) {
    return this.query((ref) => {
      let q = ref
        .where('categoryRef', '==', categoryRef)
        .where('businessRef', '==', businessRef);

      if (quantityOptions.min) {
        q = q.where('quantity', '>=', quantityOptions.min);
      }

      if (quantityOptions.max) {
        q = q.where('quantity', '<=', quantityOptions.max);
      }

      return q;
    });
  }
}
