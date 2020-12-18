import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Business, Stock } from '@anyshop/core';
import { ApiService } from '@arxis/api';
import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';

import { FirebaseItemsAbstractService } from '../firebase/firebase-items-abstract.service';
import { StockService } from '../stock/stock.service';

@Injectable({ providedIn: 'any' })
export class BusinessesService extends FirebaseItemsAbstractService<Business> {
  constructor(
    public db: AngularFirestore,
    public stock: StockService,
    private api: ApiService
  ) {
    super('/businesses', db);
  }

  add(item: Business) {
    const normalObject: any = this.toJSON(item);
    return super.add(normalObject);
  }

  set(item: any, data: any) {
    const normalObject: any = this.toJSON(data);

    return super.set(item, normalObject);
  }

  getDocByKey(key: string): AngularFirestoreDocument<Business> {
    return this.afs.doc<Business>(`${this.firebaseRoute}/${key}`);
  }

  getStockBusiness(businessId: string): Observable<Stock[]> {
    const businessRef = this.itemsCollection.doc(businessId).ref;
    const stockFilterFunction = (ref) =>
      ref
        //   .where('quantity', '>', 0)
        .where('businessRef', '==', businessRef);

    return this.stock.query(stockFilterFunction);
  }

  getStockBusinessByCategory(
    businessId: string,
    categoryName: string
  ): Observable<Stock[]> {
    const businessRef = this.itemsCollection.doc(businessId).ref;
    const stockFilterFunction = (ref) =>
      ref
        .where('product.category', '==', categoryName)
        .where('quantity', '>', 0)
        .where('businessRef', '==', businessRef);

    return this.stock.query(stockFilterFunction);
  }

  getNearByBusinessAtPoint(geoPoint: firestore.GeoPoint): Observable<any> {
    return this.api.get('searchNearByBusinesses', {
      lat: geoPoint.latitude,
      long: geoPoint.longitude,
    });
  }

  /**
   * Obtiene el promedio de la duración de sus entregas.
   *
   * @param business ID del negocio
   */
  getOrdersAverages(
    business: string,
    includes: string = 'all',
    options: {
      limit?: number;
      precision?: number;
      default?: number;
      max?: number;
    } = {}
  ): Observable<
    | {
        totalMatches: number;
        data: { deliveryDuration?: number; rating?: number };
      }
    | ArrayBuffer
  > {
    return this.api.get('businessOrdersAverages', {
      business,
      includes,
      ...options,
    });
  }
}
